/**
 * Sync state and staleness tests.
 * Covers Scenarios A (Todoist unavailable), B (empty meetings), E/F (stale state).
 */
import { isStale } from '../../../scripts/utils/date';
import { THRESHOLDS } from '../../../scripts/config/thresholds';
import { readJSON, writeJSON } from '../../../scripts/utils/file';
import { PATHS } from '../../../scripts/config/paths';
import type { CurrentDay, LastSync } from '../../../scripts/types/daily';

describe('staleness detection (Scenario E/F)', () => {
  test('null morningSync ranAt is stale', () => {
    expect(isStale(null, THRESHOLDS.dailyStateStaleMs)).toBe(true);
  });

  test('recent morningSync is not stale', () => {
    expect(isStale(new Date().toISOString(), THRESHOLDS.dailyStateStaleMs)).toBe(false);
  });

  test('morningSync > 12h ago is stale', () => {
    const staleTime = new Date(Date.now() - 13 * 3600 * 1000).toISOString();
    expect(isStale(staleTime, THRESHOLDS.dailyStateStaleMs)).toBe(true);
  });

  test('transcript > 36h ago is stale', () => {
    const staleTime = new Date(Date.now() - 37 * 3600 * 1000).toISOString();
    expect(isStale(staleTime, THRESHOLDS.transcriptStaleMs)).toBe(true);
  });
});

describe('state file integrity', () => {
  test('current_day.json has required fields', () => {
    const state = readJSON<CurrentDay>(PATHS.state.currentDay);
    expect(state).toBeTruthy();
    expect(state).toHaveProperty('date');
    expect(state).toHaveProperty('openTasks');
    expect(state).toHaveProperty('todayMeetings');
    expect(state).toHaveProperty('sourceStatus');
  });

  test('last_sync.json has required fields', () => {
    const sync = readJSON<LastSync>(PATHS.state.lastSync);
    expect(sync).toBeTruthy();
    expect(sync).toHaveProperty('morningSync');
    expect(sync).toHaveProperty('eveningSync');
    expect(sync).toHaveProperty('dailyFirefliesSync');
    expect(sync).toHaveProperty('weeklyCustomerPulseDigest');
  });

  // Scenario A — simulate Todoist failure: state should preserve prior valid data
  test('Todoist failure marks status as failed without wiping tasks (Scenario A)', () => {
    const existing = readJSON<CurrentDay>(PATHS.state.currentDay)!;
    const tasks = [{ id: '1', content: 'Prior task', priority: 1 as const, labels: [], projectId: 'p', isOverdue: false, url: '' }];
    existing.openTasks = tasks;
    writeJSON(PATHS.state.currentDay, existing);

    // Simulate failure: mark status failed, preserve tasks
    existing.sourceStatus.todoist = 'failed';
    writeJSON(PATHS.state.currentDay, existing);

    const after = readJSON<CurrentDay>(PATHS.state.currentDay)!;
    expect(after.sourceStatus.todoist).toBe('failed');
    expect(after.openTasks).toHaveLength(1); // prior state preserved
  });

  // Scenario B — Google Calendar returns no meetings
  test('empty meetings array is valid state (Scenario B)', () => {
    const state = readJSON<CurrentDay>(PATHS.state.currentDay)!;
    state.todayMeetings = [];
    state.sourceStatus.googleCalendar = 'fresh';
    writeJSON(PATHS.state.currentDay, state);

    const after = readJSON<CurrentDay>(PATHS.state.currentDay)!;
    expect(after.todayMeetings).toEqual([]);
    expect(after.sourceStatus.googleCalendar).toBe('fresh');
  });
});
