/**
 * Server-side utility: refreshes state/current_day.json after UI mutations.
 * Called fire-and-forget from API routes so the digest always reflects live Todoist state.
 */
import fs from 'fs';
import path from 'path';
import { getTasks } from './todoist';
import type { TodoistTask } from './types';

// Next.js API routes run with cwd = ui/ directory
const STATE_PATH = path.join(process.cwd(), '..', 'state', 'current_day.json');
const TIMEZONE = 'Asia/Kolkata';

const SECTION_NAMES: Record<string, string> = {
  '6g8x4JxwH876pgGQ': 'Features',
  '6g8x4HVHxpWVfVHQ': 'CS Requests',
  '6g8x4MgXR2q68fgQ': 'Engg asks',
  '6g9QcvpjJw2cFmCx': 'effy',
  '6g9wjjpVgppgxJwQ': 'CM',
};

function todayKey(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: TIMEZONE });
}

// Mirrors scripts/utils/date.ts dueSoonCutoff: today + 3 days
function dueSoonCutoff(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString('sv-SE', { timeZone: TIMEZONE });
}

function mapTask(raw: TodoistTask, today: string) {
  const dueDate = raw.due?.date ?? null;
  const isOverdue = dueDate !== null && dueDate < today;
  return {
    id: raw.id,
    content: raw.content,
    ...(raw.description ? { description: raw.description } : {}),
    due: dueDate,
    priority: raw.priority,
    labels: raw.labels,
    sectionId: raw.section_id ?? undefined,
    sectionName: raw.section_id ? (SECTION_NAMES[raw.section_id] ?? 'Unknown') : undefined,
    projectId: raw.project_id,
    isOverdue,
    url: raw.url ?? `https://todoist.com/showTask?id=${raw.id}`,
  };
}

export async function refreshCurrentDayState(token: string): Promise<void> {
  try {
    const rawTasks = await getTasks(token);
    const today = todayKey();
    const cutoff = dueSoonCutoff();
    const tasks = rawTasks.map((t: TodoistTask) => mapTask(t, today));

    let state: Record<string, unknown> = {};
    try {
      state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    } catch {
      // missing or corrupt — will be rebuilt on next scheduled sync
    }

    state.openTasks = tasks;
    state.dueSoon = tasks.filter((t) => t.due && t.due <= cutoff && !t.isOverdue);

    const tmp = STATE_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2), 'utf8');
    fs.renameSync(tmp, STATE_PATH);
  } catch (err) {
    console.error('[state] refreshCurrentDayState failed:', err);
  }
}
