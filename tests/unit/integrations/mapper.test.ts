import { mapTodoistTask } from '../../../scripts/integrations/todoist/mapper';
import { mapGCalEvent } from '../../../scripts/integrations/gcal/mapper';
import { mapFirefliesTranscript, deduplicateTranscripts } from '../../../scripts/integrations/fireflies/mapper';
import type { TodoistTask } from '../../../scripts/integrations/todoist/types';
import type { GCalEvent } from '../../../scripts/integrations/gcal/types';
import type { FirefliesTranscript } from '../../../scripts/integrations/fireflies/types';

describe('mapTodoistTask', () => {
  const today = '2026-03-18';

  test('maps basic task', () => {
    const raw: TodoistTask = {
      id: '123', content: 'Test task', description: '', due: null,
      priority: 2, labels: [], section_id: null, project_id: 'proj1',
      url: 'https://todoist.com/t/123', is_completed: false,
    };
    const result = mapTodoistTask(raw, today);
    expect(result.id).toBe('123');
    expect(result.priority).toBe(2);
    expect(result.isOverdue).toBe(false);
  });

  test('marks overdue task correctly', () => {
    const raw: TodoistTask = {
      id: '124', content: 'Old task', description: '',
      due: { date: '2026-03-01', is_recurring: false, string: 'Mar 1' },
      priority: 1, labels: [], section_id: null, project_id: 'p1',
      url: 'https://todoist.com/t/124', is_completed: false,
    };
    const result = mapTodoistTask(raw, today);
    expect(result.isOverdue).toBe(true);
    expect(result.due).toBe('2026-03-01');
  });

  test('maps section ID to name', () => {
    const raw: TodoistTask = {
      id: '125', content: 'Task', description: '', due: null,
      priority: 1, labels: [], section_id: '6g8x4HVHxpWVfVHQ',
      project_id: 'p1', url: 'https://todoist.com/t/125', is_completed: false,
    };
    const result = mapTodoistTask(raw, today);
    expect(result.sectionName).toBe('CS Requests');
    expect(result.sectionId).toBe('6g8x4HVHxpWVfVHQ');
  });
});

describe('mapGCalEvent', () => {
  test('maps event with dateTime', () => {
    const raw: GCalEvent = {
      id: 'evt1', summary: 'Team Sync',
      start: { dateTime: '2026-03-18T09:00:00+05:30' },
      end:   { dateTime: '2026-03-18T09:30:00+05:30' },
      attendees: [{ email: 'a@b.com', displayName: 'Alice' }],
      status: 'confirmed',
    };
    const result = mapGCalEvent(raw);
    expect(result.title).toBe('Team Sync');
    expect(result.attendees).toContain('Alice');
  });

  test('handles no attendees', () => {
    const raw: GCalEvent = {
      id: 'evt2', summary: 'Solo work',
      start: { dateTime: '2026-03-18T10:00:00Z' },
      end:   { dateTime: '2026-03-18T11:00:00Z' },
      status: 'confirmed',
    };
    const result = mapGCalEvent(raw);
    expect(result.attendees).toEqual([]);
  });
});

describe('mapFirefliesTranscript', () => {
  const rawTx: FirefliesTranscript = {
    id: 'ff_001', title: 'Customer Feedback',
    date: new Date('2026-03-17T09:00:00Z').getTime(),
    participants: ['Alice', 'Bob'],
    summary: { overview: 'Good call', action_items: 'Follow up on X' },
    transcript: 'Alice: Hello...',
    meeting_link: 'https://meet.google.com/abc',
  };

  test('maps all required fields', () => {
    const result = mapFirefliesTranscript(rawTx, '2026-03-17');
    expect(result.transcriptId).toBe('ff_001');
    expect(result.meetingTitle).toBe('Customer Feedback');
    expect(result.sourceDay).toBe('2026-03-17');
    expect(result.participants).toEqual(['Alice', 'Bob']);
    expect(result.summary).toContain('Good call');
    expect(result.transcriptText).toBe('Alice: Hello...');
  });

  // Scenario C — deduplication
  test('deduplicateTranscripts removes duplicates', () => {
    const mapped = mapFirefliesTranscript(rawTx, '2026-03-17');
    const result = deduplicateTranscripts([mapped, mapped, mapped]);
    expect(result).toHaveLength(1);
  });

  test('deduplicateTranscripts keeps distinct IDs', () => {
    const a = mapFirefliesTranscript(rawTx, '2026-03-17');
    const b = mapFirefliesTranscript({ ...rawTx, id: 'ff_002' }, '2026-03-17');
    expect(deduplicateTranscripts([a, b])).toHaveLength(2);
  });
});
