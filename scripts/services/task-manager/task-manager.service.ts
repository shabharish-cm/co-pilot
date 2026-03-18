import { ENV } from '../../config/env';
import { PATHS } from '../../config/paths';
import { TodoistClient } from '../../integrations/todoist/client';
import { mapTodoistTask } from '../../integrations/todoist/mapper';
import { readJSON, writeJSON } from '../../utils/file';
import { todayKey, isoNow } from '../../utils/date';
import { logger } from '../../utils/logger';
import type { TaskRecord, CurrentDay } from '../../types/daily';
import type { TodoistCreatePayload, TodoistUpdatePayload } from '../../integrations/todoist/types';

export interface CreateTaskOptions {
  content: string;
  description?: string;
  dueString?: string;
  priority?: 1 | 2 | 3 | 4;
  labels?: string[];
  sectionId?: string;
}

export interface UpdateTaskOptions {
  content?: string;
  description?: string;
  dueString?: string;
  priority?: 1 | 2 | 3 | 4;
  labels?: string[];
}

function getClient(): TodoistClient {
  return new TodoistClient(ENV.todoist.apiToken);
}

/** Refresh openTasks in state after any mutation. */
async function refreshState(): Promise<void> {
  const tz      = ENV.timezone;
  const today   = todayKey(tz);
  const client  = getClient();
  const rawTasks = await client.getActiveTasks(ENV.todoist.projectId);
  const tasks    = rawTasks.map(t => mapTodoistTask(t, today));

  const state = readJSON<CurrentDay>(PATHS.state.currentDay);
  if (state) {
    state.openTasks = tasks;
    writeJSON(PATHS.state.currentDay, state);
  }
}

export async function createTask(opts: CreateTaskOptions): Promise<TaskRecord> {
  const client = getClient();
  const payload: TodoistCreatePayload = {
    content:    opts.content,
    project_id: ENV.todoist.projectId,
  };
  if (opts.description) payload.description = opts.description;
  if (opts.dueString)   payload.due_string  = opts.dueString;
  if (opts.priority)    payload.priority    = opts.priority;
  if (opts.labels)      payload.labels      = opts.labels;
  if (opts.sectionId)   payload.section_id  = opts.sectionId;

  const raw    = await client.createTask(payload);
  const task   = mapTodoistTask(raw, todayKey(ENV.timezone));
  logger.info('Task created', { id: task.id, content: task.content });
  await refreshState();
  return task;
}

export async function updateTask(taskId: string, opts: UpdateTaskOptions): Promise<TaskRecord> {
  const client = getClient();
  const payload: TodoistUpdatePayload = {};
  if (opts.content)     payload.content    = opts.content;
  if (opts.description) payload.description = opts.description;
  if (opts.dueString)   payload.due_string = opts.dueString;
  if (opts.priority)    payload.priority   = opts.priority;
  if (opts.labels)      payload.labels     = opts.labels;

  const raw  = await client.updateTask(taskId, payload);
  const task = mapTodoistTask(raw, todayKey(ENV.timezone));
  logger.info('Task updated', { id: task.id });
  await refreshState();
  return task;
}

export async function completeTask(taskId: string): Promise<void> {
  const client = getClient();
  await client.completeTask(taskId);
  logger.info('Task completed', { id: taskId });
  await refreshState();
}

/** Find tasks matching a query string (case-insensitive substring). */
export function findMatchingTasks(query: string): TaskRecord[] {
  const state = readJSON<CurrentDay>(PATHS.state.currentDay);
  if (!state) return [];
  const lower = query.toLowerCase();
  return state.openTasks.filter(t => t.content.toLowerCase().includes(lower));
}
