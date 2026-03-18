/**
 * Task manager tests — covers Scenarios G (ambiguous /done) and task state management.
 */
import { findMatchingTasks } from '../../../scripts/services/task-manager/task-manager.service';
import { writeJSON } from '../../../scripts/utils/file';
import { PATHS } from '../../../scripts/config/paths';
import type { CurrentDay } from '../../../scripts/types/daily';

function makeCurrentDay(tasks: Array<{ id: string; content: string }>): CurrentDay {
  return {
    date: '2026-03-18',
    timezone: 'Asia/Kolkata',
    lastMorningSyncAt: new Date().toISOString(),
    lastEveningSyncAt: null,
    sourceStatus: { todoist: 'fresh', googleCalendar: 'fresh' },
    openTasks: tasks.map(t => ({
      id: t.id, content: t.content, priority: 1 as const,
      labels: [], projectId: 'proj1', isOverdue: false, url: '',
    })),
    completedToday: [],
    dueSoon: [],
    todayMeetings: [],
    digestPaths: { morning: null, eod: null },
  };
}

describe('findMatchingTasks', () => {
  beforeEach(() => {
    writeJSON(PATHS.state.currentDay, makeCurrentDay([
      { id: '1', content: 'Write PRD for reporting' },
      { id: '2', content: 'Write PRD for analytics' },
      { id: '3', content: 'Review API contract' },
    ]));
  });

  test('returns single match for unambiguous query', () => {
    const results = findMatchingTasks('Review API');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('3');
  });

  test('returns multiple matches for ambiguous query (Scenario G)', () => {
    // "PRD" matches two tasks — /done must disambiguate
    const results = findMatchingTasks('PRD');
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  test('returns empty array for no match', () => {
    const results = findMatchingTasks('nonexistent task xyz');
    expect(results).toHaveLength(0);
  });

  test('matching is case-insensitive', () => {
    expect(findMatchingTasks('write prd')).toHaveLength(2);
    expect(findMatchingTasks('WRITE PRD')).toHaveLength(2);
  });
});
