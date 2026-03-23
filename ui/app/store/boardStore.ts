'use client';

import { create } from 'zustand';
import type {
  TaskWithMeta,
  TaskStatus,
  SectionKey,
  CreateTaskPayload,
  TodoistComment,
} from '../lib/types';
import {
  replaceStatusLabel,
  SECTION_CONFIGS,
} from '../lib/utils';

export type ActiveTab = 'home' | 'board' | 'pulse' | 'prd' | 'settings';

const POLL_INTERVAL_MS = 15 * 60 * 1000; // 15 min
const MUTATION_GRACE_MS = 15 * 60 * 1000; // skip overwriting tasks mutated in last 15 min

function readLocalBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === 'true';
  } catch {
    return fallback;
  }
}

interface BoardStore {
  tasks: TaskWithMeta[];
  lastFetch: number;
  lastMutated: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  selectedTaskId: string | null;
  drawerOpen: boolean;
  sidebarOpen: boolean;
  filterSection: SectionKey | null;
  filterStatus: TaskStatus | null;
  filterDue: ('overdue' | 'today' | 'this-week')[];

  activeTab: ActiveTab;
  enableUpNext: boolean;
  enableBlocked: boolean;

  fetchTasks: () => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  moveTaskToSection: (id: string, sectionId: string, sectionKey: SectionKey) => Promise<void>;
  updateTask: (id: string, payload: Partial<Pick<TaskWithMeta, 'content' | 'description' | 'due' | 'labels' | 'priority' | 'section_id' | 'sectionKey'>>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  addComment: (id: string, content: string) => Promise<void>;
  fetchComments: (id: string) => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<{ task: TaskWithMeta; routing: unknown }>;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setFilter: (type: 'section' | 'status' | 'due', value: string | null) => void;
  clearFilters: () => void;
  getFilteredTasks: () => TaskWithMeta[];

  setActiveTab: (tab: ActiveTab) => void;
  setEnableUpNext: (v: boolean) => void;
  setEnableBlocked: (v: boolean) => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  tasks: [],
  lastFetch: 0,
  lastMutated: {},
  isLoading: false,
  error: null,
  selectedTaskId: null,
  drawerOpen: false,
  sidebarOpen: false,
  filterSection: null,
  filterStatus: null,
  filterDue: [],

  activeTab: 'home',
  enableUpNext: readLocalBool('pm-copilot-enable-upnext', false),
  enableBlocked: readLocalBool('pm-copilot-enable-blocked', false),

  setActiveTab: (tab: ActiveTab) => set({ activeTab: tab }),

  setEnableUpNext: (v: boolean) => {
    try { localStorage.setItem('pm-copilot-enable-upnext', String(v)); } catch { /* noop */ }
    set({ enableUpNext: v });
  },

  setEnableBlocked: (v: boolean) => {
    try { localStorage.setItem('pm-copilot-enable-blocked', String(v)); } catch { /* noop */ }
    set({ enableBlocked: v });
  },

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/todoist/tasks');
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const freshTasks: TaskWithMeta[] = await res.json();

      const now = Date.now();
      const { lastMutated, tasks: existing } = get();

      // Merge: if a task was mutated locally in the last 15 min, keep local version
      const merged = freshTasks.map(ft => {
        const mutAt = lastMutated[ft.id];
        if (mutAt && now - mutAt < MUTATION_GRACE_MS) {
          const local = existing.find(t => t.id === ft.id);
          return local ?? ft;
        }
        return ft;
      });

      set({ tasks: merged, lastFetch: now, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      set({ error: msg, isLoading: false });
    }
  },

  updateTaskStatus: async (id: string, status: TaskStatus) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newLabels = replaceStatusLabel(task.labels, status);

    // Optimistic update
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, labels: newLabels, status } : t),
      lastMutated: { ...state.lastMutated, [id]: Date.now() },
    }));

    try {
      const res = await fetch(`/api/todoist/task/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labels: newLabels }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
    } catch (e) {
      // Revert on error
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? task : t),
        error: e instanceof Error ? e.message : 'Update failed',
      }));
    }
  },

  moveTaskToSection: async (id: string, sectionId: string, sectionKey: SectionKey) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic update
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, section_id: sectionId, sectionKey } : t),
      lastMutated: { ...state.lastMutated, [id]: Date.now() },
    }));

    try {
      const res = await fetch(`/api/todoist/task/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_id: sectionId }),
      });
      if (!res.ok) throw new Error(`Move failed: ${res.status}`);
    } catch (e) {
      // Revert
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? task : t),
        error: e instanceof Error ? e.message : 'Move failed',
      }));
    }
  },

  updateTask: async (id, payload) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Build API payload
    const apiPayload: Record<string, unknown> = {};
    if (payload.content !== undefined) apiPayload.content = payload.content;
    if (payload.description !== undefined) apiPayload.description = payload.description;
    if (payload.labels !== undefined) apiPayload.labels = payload.labels;
    if (payload.priority !== undefined) apiPayload.priority = payload.priority;
    if (payload.section_id !== undefined) apiPayload.section_id = payload.section_id;
    if (payload.due !== undefined) apiPayload.due_date = payload.due?.date ?? null;

    // Optimistic update
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...payload } : t),
      lastMutated: { ...state.lastMutated, [id]: Date.now() },
    }));

    try {
      const res = await fetch(`/api/todoist/task/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
    } catch (e) {
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? task : t),
        error: e instanceof Error ? e.message : 'Update failed',
      }));
    }
  },

  completeTask: async (id: string) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic: remove from board
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id),
      lastMutated: { ...state.lastMutated, [id]: Date.now() },
      drawerOpen: state.selectedTaskId === id ? false : state.drawerOpen,
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
    }));

    try {
      const res = await fetch(`/api/todoist/task/${id}/complete`, { method: 'POST' });
      if (!res.ok) throw new Error(`Complete failed: ${res.status}`);
    } catch (e) {
      // Revert
      set(state => ({
        tasks: [...state.tasks, task],
        error: e instanceof Error ? e.message : 'Complete failed',
      }));
    }
  },

  addComment: async (id: string, content: string) => {
    try {
      const res = await fetch(`/api/todoist/task/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(`Comment failed: ${res.status}`);
      const comment = await res.json();

      set(state => ({
        tasks: state.tasks.map(t =>
          t.id === id
            ? { ...t, comments: [...(t.comments ?? []), comment] }
            : t
        ),
      }));
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Comment failed' });
    }
  },

  fetchComments: async (id: string) => {
    try {
      const res = await fetch(`/api/todoist/task/${id}/comments`);
      if (!res.ok) throw new Error(`Fetch comments failed: ${res.status}`);
      const comments: TodoistComment[] = await res.json();
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, comments } : t),
      }));
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Fetch comments failed' });
    }
  },

  createTask: async (payload: CreateTaskPayload) => {
    const res = await fetch('/api/todoist/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Create task failed: ${res.status}`);
    const data = await res.json();

    // Add to local store
    set(state => ({ tasks: [...state.tasks, data.task] }));
    return data;
  },

  openDrawer: (id: string) => set({ selectedTaskId: id, drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false, selectedTaskId: null }),

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  setFilter: (type, value) => {
    if (type === 'section') set({ filterSection: value as SectionKey | null });
    if (type === 'status') set({ filterStatus: value as TaskStatus | null });
    if (type === 'due') {
      const v = value as 'overdue' | 'today' | 'this-week';
      const { filterDue } = get();
      const next = filterDue.includes(v) ? filterDue.filter(d => d !== v) : [...filterDue, v];
      set({ filterDue: next });
    }
  },

  clearFilters: () => set({ filterSection: null, filterStatus: null, filterDue: [] }),

  getFilteredTasks: () => {
    const { tasks, filterSection, filterStatus, filterDue } = get();
    return tasks.filter(t => {
      if (t.parent_id) return false; // subtasks not shown on board
      if (filterSection && t.sectionKey !== filterSection) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      if (filterDue.length > 0) {
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const matches = filterDue.some(d => {
          if (d === 'overdue') return t.isOverdue;
          if (d === 'today') return !!t.due && t.due.date === today;
          if (d === 'this-week') return !!t.due && new Date(t.due.date) <= weekEnd;
          return false;
        });
        if (!matches) return false;
      }
      return true;
    });
  },
}));

// Auto-poll setup — called from the board component
let pollTimer: ReturnType<typeof setInterval> | null = null;

export function startPolling(fetchFn: () => Promise<void>) {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(fetchFn, POLL_INTERVAL_MS);
}

export function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}
