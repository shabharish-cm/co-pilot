/**
 * Morning sync: fetches open/overdue Todoist tasks + today's GCal events.
 * Non-AI. No Claude calls.
 */
import path from 'path';
import { ENV } from '../../config/env';
import { PATHS } from '../../config/paths';
import { TodoistClient } from '../../integrations/todoist/client';
import { GCalClient } from '../../integrations/gcal/client';
import { mapTodoistTask } from '../../integrations/todoist/mapper';
import { mapGCalEvent } from '../../integrations/gcal/mapper';
import { readJSON, writeJSON } from '../../utils/file';
import { todayKey, dayStartUTC, dayEndUTC, isoNow } from '../../utils/date';
import { logger } from '../../utils/logger';
import type { CurrentDay, LastSync } from '../../types/daily';

export async function runMorningSync(): Promise<void> {
  const tz    = ENV.timezone;
  const today = todayKey(tz);
  logger.info('Morning sync started', { date: today });

  const existing = readJSON<CurrentDay>(PATHS.state.currentDay);
  const lastSync = readJSON<LastSync>(PATHS.state.lastSync);

  const state: CurrentDay = existing ?? {
    date: today,
    timezone: tz,
    lastMorningSyncAt: null,
    lastEveningSyncAt: null,
    sourceStatus: { todoist: 'missing', googleCalendar: 'missing' },
    openTasks: [],
    completedToday: [],
    dueSoon: [],
    todayMeetings: [],
    digestPaths: { morning: null, eod: null },
  };

  // Reset for today if date changed
  if (state.date !== today) {
    state.date = today;
    state.completedToday = [];
    state.digestPaths = { morning: null, eod: null };
  }

  const syncResult: LastSync = lastSync ?? {
    morningSync:    { ranAt: null, status: null },
    eveningSync:    { ranAt: null, status: null },
    dailyFirefliesSync:        { ranAt: null, status: null, dayKey: undefined },
    weeklyCustomerPulseDigest: { ranAt: null, status: null },
  };

  // ── Todoist ──────────────────────────────────────────────────────────────
  try {
    const todoist = new TodoistClient(ENV.todoist.apiToken);
    const rawTasks = await todoist.getActiveTasks(ENV.todoist.projectId);
    const tasks = rawTasks.map(t => mapTodoistTask(t, today));
    state.openTasks   = tasks.filter(t => !t.isOverdue);
    // isOverdue tasks stay in openTasks too so /morning can surface them
    state.sourceStatus.todoist = 'fresh';
    logger.info('Todoist fetched', { count: tasks.length });
  } catch (err) {
    state.sourceStatus.todoist = 'failed';
    syncResult.morningSync.error = String(err);
    logger.error('Todoist fetch failed', err);
  }

  // ── Google Calendar ──────────────────────────────────────────────────────
  try {
    const gcal = new GCalClient({
      clientId:     ENV.gcal.clientId,
      clientSecret: ENV.gcal.clientSecret,
      refreshToken: ENV.gcal.refreshToken,
      calendarId:   ENV.gcal.calendarId,
    });
    const timeMin = dayStartUTC(today, tz).toISOString();
    const timeMax = dayEndUTC(today, tz).toISOString();
    const rawEvents = await gcal.getEventsForDay(timeMin, timeMax);
    state.todayMeetings = rawEvents.map(mapGCalEvent);
    state.sourceStatus.googleCalendar = 'fresh';
    logger.info('GCal fetched', { count: rawEvents.length });
  } catch (err) {
    state.sourceStatus.googleCalendar = 'failed';
    syncResult.morningSync.error = String(err);
    logger.error('GCal fetch failed', err);
  }

  const now = isoNow();
  state.lastMorningSyncAt = now;

  // ── Write raw snapshot ────────────────────────────────────────────────────
  const snapshotPath = path.join(PATHS.daily.raw, `${today}-morning.json`);
  writeJSON(snapshotPath, { date: today, fetchedAt: now, openTasks: state.openTasks, todayMeetings: state.todayMeetings });

  // ── Write canonical state ─────────────────────────────────────────────────
  writeJSON(PATHS.state.currentDay, state);

  const overallStatus = (state.sourceStatus.todoist === 'failed' || state.sourceStatus.googleCalendar === 'failed')
    ? 'failed' : 'success';
  syncResult.morningSync = { ranAt: now, status: overallStatus };
  writeJSON(PATHS.state.lastSync, syncResult);

  logger.info('Morning sync complete', { status: overallStatus });
}

// ── Entrypoint ───────────────────────────────────────────────────────────────
if (require.main === module) {
  runMorningSync().catch(err => {
    logger.error('Morning sync fatal error', err);
    process.exit(1);
  });
}
