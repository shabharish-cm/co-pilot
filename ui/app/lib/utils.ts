import { format, parseISO, isToday, isBefore, startOfDay } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import type { TaskWithMeta, SectionKey, TaskStatus, ValueEffort, SectionConfig } from './types';

export const IST_TIMEZONE = 'Asia/Kolkata';

export const TODOIST_PROJECT_ID = '6g8q49QQxHrFxRFx';

export const SECTION_CONFIGS: Record<SectionKey, SectionConfig> = {
  csRequests: { id: '6g8x4HVHxpWVfVHQ', name: 'CS Requests', key: 'csRequests', color: '#FF90E8', bgColor: 'rgba(255,144,232,0.08)' },
  enggAsks:   { id: '6g8x4MgXR2q68fgQ', name: 'Engg asks',   key: 'enggAsks',   color: '#A8D8FF', bgColor: 'rgba(168,216,255,0.08)' },
  features:   { id: '6g8x4JxwH876pgGQ', name: 'Features',    key: 'features',   color: '#E8E8E8', bgColor: 'rgba(232,232,232,0.15)' },
  cm:         { id: '6g9wjjpVgppgxJwQ', name: 'CM',          key: 'cm',         color: '#FFB347', bgColor: 'rgba(255,179,71,0.08)' },
  effy:       { id: '6g9QcvpjJw2cFmCx', name: 'effy',        key: 'effy',       color: '#B9F0A0', bgColor: 'rgba(185,240,160,0.08)' },
};

export const SECTION_ORDER: SectionKey[] = ['csRequests', 'enggAsks', 'features', 'cm', 'effy'];

export const STATUS_ORDER: TaskStatus[] = ['backlog', 'up-next', 'in-progress', 'blocked', 'done'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'backlog':     'BACKLOG',
  'up-next':     'UP NEXT',
  'in-progress': 'IN PROGRESS',
  'blocked':     'BLOCKED',
  'done':        'DONE',
};

export function sectionIdToKey(sectionId: string | null): SectionKey {
  if (!sectionId) return 'features';
  for (const [key, cfg] of Object.entries(SECTION_CONFIGS)) {
    if (cfg.id === sectionId) return key as SectionKey;
  }
  return 'features';
}

export function getStatusFromLabels(labels: string[]): TaskStatus {
  const statusLabel = labels.find(l => l.startsWith('status:'));
  if (!statusLabel) return 'backlog';
  const status = statusLabel.replace('status:', '') as TaskStatus;
  return STATUS_ORDER.includes(status) ? status : 'backlog';
}

export function replaceStatusLabel(labels: string[], newStatus: TaskStatus): string[] {
  const nonStatus = labels.filter(l => !l.startsWith('status:'));
  if (newStatus === 'backlog') return nonStatus; // no label needed for backlog
  return [...nonStatus, `status:${newStatus}`];
}

export function parseValueEffort(description: string): ValueEffort | undefined {
  if (!description) return undefined;
  // Match patterns like: V:H E:M, Value: H Effort: L, V: M E: H etc.
  const valueMatch = description.match(/\bV(?:alue)?[:\s]+([HML])\b/i);
  const effortMatch = description.match(/\bE(?:ffort)?[:\s]+([HML])\b/i);
  if (!valueMatch || !effortMatch) return undefined;

  const value = valueMatch[1].toUpperCase() as 'H' | 'M' | 'L';
  const effort = effortMatch[1].toUpperCase() as 'H' | 'M' | 'L';

  let placement: string;
  if (value === 'H' && effort === 'L') placement = 'QUICK WIN';
  else if (value === 'H' && effort === 'H') placement = 'STRATEGIC BET';
  else if (value === 'L' && effort === 'L') placement = 'RECONSIDER';
  else placement = 'AVOID / DEFER';

  return { value, effort, placement };
}

export function isTaskOverdue(due: { date: string; datetime?: string } | null): boolean {
  if (!due) return false;
  const today = startOfDay(new Date());
  const dueDate = parseISO(due.date);
  return isBefore(dueDate, today);
}

export function formatDueDate(due: { date: string; datetime?: string } | null): string | null {
  if (!due) return null;
  try {
    const date = parseISO(due.date);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d');
  } catch {
    return null;
  }
}

export function formatISTTime(date: Date): string {
  return formatInTimeZone(date, IST_TIMEZONE, 'hh:mm a');
}

export function formatISTDateTime(date: Date): string {
  return formatInTimeZone(date, IST_TIMEZONE, 'EEE, MMM d · hh:mm a');
}

export function nowInIST(): Date {
  return toZonedTime(new Date(), IST_TIMEZONE);
}

export function formatCalendarDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'EEE, MMM d');
  } catch {
    return dateStr;
  }
}

export function priorityColor(priority: 1 | 2 | 3 | 4): string {
  switch (priority) {
    case 1: return '#FF3B00';
    case 2: return '#FFE500';
    case 3: return '#ccc';
    case 4: return '#ccc';
  }
}

export function placementColor(placement: string): string {
  switch (placement) {
    case 'QUICK WIN':      return '#B9F0A0';
    case 'STRATEGIC BET':  return '#A8D8FF';
    case 'RECONSIDER':     return '#E8E8E8';
    case 'AVOID / DEFER':  return '#FFB347';
    default:               return '#E8E8E8';
  }
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len).trimEnd() + '…';
}

// Strip markdown links from Todoist task content
export function cleanContent(content: string): string {
  return content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

export function todayDigestPath(): string {
  const now = nowInIST();
  const dateStr = format(now, 'yyyy-MM-dd');
  return `${dateStr}-morning.md`;
}
