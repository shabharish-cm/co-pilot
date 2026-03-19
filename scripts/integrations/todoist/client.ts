import axios, { AxiosInstance } from 'axios';
import { withRetry } from '../../utils/retry';
import type { TodoistTask, TodoistCreatePayload, TodoistUpdatePayload } from './types';

const BASE_URL = 'https://api.todoist.com/api/v1';

export class TodoistClient {
  private http: AxiosInstance;

  constructor(apiToken: string) {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${apiToken}` },
    });
  }

  async getActiveTasks(projectId: string): Promise<TodoistTask[]> {
    return withRetry(async () => {
      const res = await this.http.get<{ results: TodoistTask[] } | TodoistTask[]>('/tasks', {
        params: { project_id: projectId },
      });
      // API v1 wraps results; fall back to flat array for compatibility
      const data = res.data as any;
      return Array.isArray(data) ? data : (data.results ?? []);
    }, {}, 'todoist:getActiveTasks');
  }

  async getCompletedTasks(projectId: string, since: string, until: string): Promise<TodoistTask[]> {
    return withRetry(async () => {
      const all: TodoistTask[] = [];
      let cursor: string | undefined;

      do {
        const res = await this.http.get<{ items: TodoistTask[]; next_cursor?: string | null }>(
          '/tasks/completed/by_completion_date',
          {
            params: {
              project_id: projectId,
              since,
              until,
              ...(cursor ? { cursor } : {}),
            },
          },
        );

        all.push(...(res.data.items ?? []));
        cursor = res.data.next_cursor ?? undefined;
      } while (cursor);

      return all;
    }, {}, 'todoist:getCompletedTasks');
  }

  async createTask(payload: TodoistCreatePayload): Promise<TodoistTask> {
    return withRetry(async () => {
      const res = await this.http.post<TodoistTask>('/tasks', payload);
      return res.data;
    }, {}, 'todoist:createTask');
  }

  async updateTask(taskId: string, payload: TodoistUpdatePayload): Promise<TodoistTask> {
    return withRetry(async () => {
      const res = await this.http.post<TodoistTask>(`/tasks/${taskId}`, payload);
      return res.data;
    }, {}, 'todoist:updateTask');
  }

  async completeTask(taskId: string): Promise<void> {
    return withRetry(async () => {
      await this.http.post(`/tasks/${taskId}/close`);
    }, {}, 'todoist:completeTask');
  }

  async getTaskById(taskId: string): Promise<TodoistTask> {
    return withRetry(async () => {
      const res = await this.http.get<TodoistTask>(`/tasks/${taskId}`);
      return res.data;
    }, {}, 'todoist:getTaskById');
  }
}
