// ─── Todoist raw types ───────────────────────────────────────────────────────

export interface TodoistDue {
  date: string;
  is_recurring: boolean;
  datetime?: string;
  string: string;
  timezone?: string;
}

export interface TodoistTask {
  id: string;
  content: string;
  description: string;
  due: TodoistDue | null;
  priority: 1 | 2 | 3 | 4;
  labels: string[];
  section_id: string | null;
  project_id: string;
  parent_id?: string | null;
  url?: string;
  is_completed?: boolean;
  completed_at?: string | null;
}

export interface TodoistCreatePayload {
  content: string;
  description?: string;
  due_string?: string;
  due_date?: string;
  priority?: 1 | 2 | 3 | 4;
  labels?: string[];
  section_id?: string;
  project_id?: string;
  parent_id?: string;
}

export interface TodoistUpdatePayload {
  content?: string;
  description?: string;
  due_string?: string;
  due_date?: string;
  priority?: 1 | 2 | 3 | 4;
  labels?: string[];
  section_id?: string;
}

export interface TodoistComment {
  id: string;
  task_id: string;
  content: string;
  posted_at: string;
}

// ─── Board types ─────────────────────────────────────────────────────────────

export type TaskStatus = 'backlog' | 'up-next' | 'in-progress' | 'blocked' | 'done';
export type SectionKey = 'csRequests' | 'enggAsks' | 'features' | 'cm' | 'effy';

export interface ValueEffort {
  value: 'H' | 'M' | 'L';
  effort: 'H' | 'M' | 'L';
  placement: string;
}

export interface TaskWithMeta {
  id: string;
  content: string;
  description: string;
  due: { date: string; datetime?: string } | null;
  priority: 1 | 2 | 3 | 4;
  labels: string[];
  section_id: string;
  sectionKey: SectionKey;
  status: TaskStatus;
  isOverdue: boolean;
  parent_id?: string | null;
  valueEffort?: ValueEffort;
  comments?: TodoistComment[];
  mutatedAt?: number;
}

export interface CreateTaskPayload {
  content: string;
  description?: string;
  due_date?: string;
  priority?: 1 | 2 | 3 | 4;
  labels?: string[];
  section_id?: string;
}

// ─── Routing types ───────────────────────────────────────────────────────────

export type RoutingConfidence = 'matched' | 'inferred' | 'label-inferred' | 'defaulted';

export interface RoutingResult {
  sectionId: string;
  sectionName: string;
  rule: string;
  confidence: RoutingConfidence;
  match?: string;
  competingMatch?: { rule: string; match: string };
}

// ─── GCal types ──────────────────────────────────────────────────────────────

export interface GCalDateTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

export interface GCalAttendee {
  email: string;
  displayName?: string;
  responseStatus?: string;
}

export interface GCalEvent {
  id: string;
  summary: string;
  description?: string;
  start: GCalDateTime;
  end: GCalDateTime;
  attendees?: GCalAttendee[];
  hangoutLink?: string;
  status: string;
}

export interface GCalDayGroup {
  date: string;
  label: string;
  events: GCalEvent[];
}

// ─── Claude types ─────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Section config ───────────────────────────────────────────────────────────

export interface SectionConfig {
  id: string;
  name: string;
  key: SectionKey;
  color: string;
  bgColor: string;
}
