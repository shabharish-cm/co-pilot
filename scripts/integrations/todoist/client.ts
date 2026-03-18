import axios, { AxiosInstance } from 'axios';
import { withRetry } from '../../utils/retry';
import type { TodoistTask, TodoistCreatePayload, TodoistUpdatePayload } from './types';

const BASE_URL = 'https://api.todoist.com/rest/v2';

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
      const res = await this.http.get<TodoistTask[]>('/tasks', {
        params: { project_id: projectId },
      });
      return res.data;
    }, {}, 'todoist:getActiveTasks');
  }

  async getCompletedTasks(projectId: string, since: string, until: string): Promise<TodoistTask[]> {
    return withRetry(async () => {
      const res = await this.http.get<{ items: TodoistTask[] }>('https://api.todoist.com/sync/v9/items/completed/get_all', {
        params: { project_id: projectId, since, until },
      });
      return res.data.items ?? [];
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
