/** Raw Todoist REST API v2 shapes */
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
  url: string;
  is_completed: boolean;
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
}

export interface TodoistUpdatePayload {
  content?: string;
  description?: string;
  due_string?: string;
  due_date?: string;
  priority?: 1 | 2 | 3 | 4;
  labels?: string[];
}
