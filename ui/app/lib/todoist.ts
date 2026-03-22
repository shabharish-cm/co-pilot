// Todoist API helper — replicated from scripts/integrations/todoist/client.ts
// Uses fetch instead of axios to avoid edge-runtime issues

import type {
  TodoistTask,
  TodoistCreatePayload,
  TodoistUpdatePayload,
  TodoistComment,
  TaskWithMeta,
} from './types';
import {
  sectionIdToKey,
  getStatusFromLabels,
  isTaskOverdue,
  parseValueEffort,
  TODOIST_PROJECT_ID,
} from './utils';

const BASE_URL = 'https://api.todoist.com/api/v1';

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function getTasks(token: string): Promise<TodoistTask[]> {
  const res = await fetch(`${BASE_URL}/tasks?project_id=${TODOIST_PROJECT_ID}`, {
    headers: authHeaders(token),
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Todoist tasks fetch failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function updateTask(token: string, taskId: string, payload: TodoistUpdatePayload): Promise<TodoistTask> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Todoist task update failed: ${res.status}`);
  return res.json();
}

export async function completeTask(token: string, taskId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/close`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Todoist task complete failed: ${res.status}`);
}

export async function createTask(token: string, payload: TodoistCreatePayload): Promise<TodoistTask> {
  const body = { ...payload, project_id: TODOIST_PROJECT_ID };
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Todoist task create failed: ${res.status}`);
  return res.json();
}

export async function getComments(token: string, taskId: string): Promise<TodoistComment[]> {
  const res = await fetch(`${BASE_URL}/comments?task_id=${taskId}`, {
    headers: authHeaders(token),
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Todoist comments fetch failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function addComment(token: string, taskId: string, content: string): Promise<TodoistComment> {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ task_id: taskId, content }),
  });
  if (!res.ok) throw new Error(`Todoist comment add failed: ${res.status}`);
  return res.json();
}

export function enrichTask(task: TodoistTask): TaskWithMeta {
  const sectionKey = sectionIdToKey(task.section_id);
  const status = getStatusFromLabels(task.labels);
  const isOverdue = isTaskOverdue(task.due ? { date: task.due.date, datetime: task.due.datetime } : null);
  const valueEffort = parseValueEffort(task.description ?? '');

  return {
    id: task.id,
    content: task.content,
    description: task.description ?? '',
    due: task.due ? { date: task.due.date, datetime: task.due.datetime } : null,
    priority: task.priority,
    labels: task.labels,
    section_id: task.section_id ?? '',
    sectionKey,
    status,
    isOverdue,
    valueEffort,
  };
}
