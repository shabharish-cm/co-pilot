import { TaskRecord } from '../../types/daily';
import { TODOIST_SECTIONS } from '../../config/sections';
import type { TodoistTask } from './types';

const SECTION_ID_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.values(TODOIST_SECTIONS).map(s => [s.id, s.name]),
);

export function mapTodoistTask(raw: TodoistTask, todayKey: string): TaskRecord {
  const dueDate = raw.due?.date ?? null;
  const isOverdue = dueDate !== null && dueDate < todayKey;
  return {
    id:          raw.id,
    content:     raw.content,
    description: raw.description || undefined,
    due:         dueDate,
    priority:    raw.priority,
    labels:      raw.labels,
    sectionId:   raw.section_id ?? undefined,
    sectionName: raw.section_id ? (SECTION_ID_TO_NAME[raw.section_id] ?? 'Unknown') : undefined,
    projectId:   raw.project_id,
    isOverdue,
    url:         raw.url,
  };
}
