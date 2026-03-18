export interface TaskRecord {
  id: string;
  content: string;
  description?: string;
  due?: string | null;        // ISO date string
  priority: 1 | 2 | 3 | 4;  // 1=normal, 4=urgent (Todoist convention)
  labels: string[];
  sectionId?: string;
  sectionName?: string;
  projectId: string;
  isOverdue: boolean;
  url: string;
  completedVia?: 'claude' | 'manual';  // set on completedToday entries
  completedAt?: string;                // ISO datetime, set on completedToday entries
}

/** Written by task-manager whenever a task is completed via Claude. Reset each morning. */
export interface ClaudeCompletedLog {
  date: string;           // YYYY-MM-DD
  tasks: Array<{
    id: string;
    content: string;
    completedAt: string;  // ISO datetime
  }>;
}

export interface MeetingRecord {
  id: string;
  title: string;
  startTime: string;   // ISO datetime
  endTime: string;     // ISO datetime
  attendees: string[];
  meetLink?: string;
  description?: string;
}

export type SourceStatus = 'fresh' | 'stale' | 'failed' | 'missing';

export interface CurrentDay {
  date: string;            // YYYY-MM-DD
  timezone: string;
  lastMorningSyncAt: string | null;
  lastEveningSyncAt: string | null;
  sourceStatus: {
    todoist: SourceStatus;
    googleCalendar: SourceStatus;
  };
  openTasks: TaskRecord[];
  completedToday: TaskRecord[];
  dueSoon: TaskRecord[];   // due within 3 days
  todayMeetings: MeetingRecord[];
  digestPaths: {
    morning: string | null;
    eod: string | null;
  };
}

export interface SyncEntry {
  ranAt: string | null;
  status: 'success' | 'failed' | 'skipped' | null;
  error?: string;
}

export interface TranscriptIndexEntry {
  dayKey: string;
  filePath: string;
  transcriptCount: number;
  fetchedAt: string;
}

export interface TranscriptIndex {
  lastUpdatedAt: string | null;
  entries: TranscriptIndexEntry[];
}

export interface LastSync {
  morningSync: SyncEntry;
  eveningSync: SyncEntry;
  dailyFirefliesSync: SyncEntry & { dayKey?: string };
  weeklyCustomerPulseDigest: SyncEntry & {
    weekKey?: string;
    windowStart?: string;
    windowEnd?: string;
  };
}
