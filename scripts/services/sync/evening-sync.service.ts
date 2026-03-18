/**
 * Evening sync: fetches completed tasks today + open + due in 3 days.
 * Non-AI. No Claude calls.
 */
import path from 'path';
import { ENV } from '../../config/env';
import { PATHS } from '../../config/paths';
import { TodoistClient } from '../../integrations/todoist/client';
import { mapTodoistTask } from '../../integrations/todoist/mapper';
import { readJSON, writeJSON } from '../../utils/file';
import { todayKey, dueSoonCutoff, isoNow } from '../../utils/date';
import { logger } from '../../utils/logger';
import type { CurrentDay, LastSync, TaskRecord, ClaudeCompletedLog } from '../../types/daily';

export async function runEveningSync(): Promise<void> {
  const tz    = ENV.timezone;
  const today = todayKey(tz);
  logger.info('Evening sync started', { date: today });

  const state    = readJSON<CurrentDay>(PATHS.state.currentDay);
  const lastSync = readJSON<LastSync>(PATHS.state.lastSync);

  if (!state || !lastSync) {
    logger.error('State files missing — run morning sync first');
    process.exit(1);
  }

  const cutoff = dueSoonCutoff(tz);

  // ── Todoist ──────────────────────────────────────────────────────────────
  try {
    const todoist = new TodoistClient(ENV.todoist.apiToken);

    // Still open — fetch current state
    const openRaw = await todoist.getActiveTasks(ENV.todoist.projectId);
    const open    = openRaw.map(t => mapTodoistTask(t, today));
    state.openTasks = open;
    state.dueSoon   = open.filter(t => t.due && t.due <= cutoff && !t.isOverdue);

    // ── Derive completed tasks by diffing morning snapshot ────────────────
    const morningRawPath = path.join(PATHS.daily.raw, `${today}-morning.json`);
    const morningSnap    = readJSON<{ openTasks: TaskRecord[] }>(morningRawPath);

    if (morningSnap?.openTasks) {
      const eveningIds = new Set(open.map(t => t.id));

      // Load claude_completed_today.json to flag source
      const claudeLog   = readJSON<ClaudeCompletedLog>(PATHS.state.claudeCompletedToday);
      const claudeIds   = new Set((claudeLog?.tasks ?? []).map(t => t.id));
      const claudeTimes = Object.fromEntries((claudeLog?.tasks ?? []).map(t => [t.id, t.completedAt]));

      state.completedToday = morningSnap.openTasks
        .filter(t => !eveningIds.has(t.id))
        .map(t => ({
          ...t,
          completedVia: claudeIds.has(t.id) ? 'claude' : 'manual',
          completedAt:  claudeIds.has(t.id) ? claudeTimes[t.id] : isoNow(),
        } as TaskRecord));

      logger.info('Completed tasks derived from morning diff', {
        morningCount: morningSnap.openTasks.length,
        eveningCount:  open.length,
        completed:     state.completedToday.length,
        viaClaudeCount: state.completedToday.filter(t => t.completedVia === 'claude').length,
      });
    } else {
      logger.warn('Morning snapshot not found — cannot derive completed tasks', { path: morningRawPath });
      state.completedToday = [];
    }

    state.sourceStatus.todoist = 'fresh';
    logger.info('Todoist evening fetch', { open: open.length, dueSoon: state.dueSoon.length });
  } catch (err) {
    state.sourceStatus.todoist = 'failed';
    logger.error('Todoist evening fetch failed', err);
  }

  const now = isoNow();
  state.lastEveningSyncAt = now;

  // ── Write raw snapshot ────────────────────────────────────────────────────
  const snapshotPath = path.join(PATHS.daily.raw, `${today}-evening.json`);
  writeJSON(snapshotPath, {
    date: today,
    fetchedAt: now,
    completedToday: state.completedToday,
    openTasks: state.openTasks,
    dueSoon: state.dueSoon,
  });

  writeJSON(PATHS.state.currentDay, state);

  const status = state.sourceStatus.todoist === 'failed' ? 'failed' : 'success';
  lastSync.eveningSync = { ranAt: now, status };
  writeJSON(PATHS.state.lastSync, lastSync);

  logger.info('Evening sync complete', { status });
}

if (require.main === module) {
  runEveningSync().catch(err => {
    logger.error('Evening sync fatal error', err);
    process.exit(1);
  });
}
