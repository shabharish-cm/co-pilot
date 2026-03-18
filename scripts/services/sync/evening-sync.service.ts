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
import { todayKey, dayStartUTC, dayEndUTC, dueSoonCutoff, isoNow } from '../../utils/date';
import { logger } from '../../utils/logger';
import type { CurrentDay, LastSync } from '../../types/daily';

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

    // Completed today
    const sinceISO = dayStartUTC(today, tz).toISOString();
    const untilISO = dayEndUTC(today, tz).toISOString();
    const completedRaw = await todoist.getCompletedTasks(ENV.todoist.projectId, sinceISO, untilISO);
    state.completedToday = completedRaw.map(t => mapTodoistTask(t, today));

    // Still open
    const openRaw = await todoist.getActiveTasks(ENV.todoist.projectId);
    const open    = openRaw.map(t => mapTodoistTask(t, today));
    state.openTasks = open;
    state.dueSoon   = open.filter(t => t.due && t.due <= cutoff && !t.isOverdue);

    state.sourceStatus.todoist = 'fresh';
    logger.info('Todoist evening fetch', { completed: state.completedToday.length, open: open.length, dueSoon: state.dueSoon.length });
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
