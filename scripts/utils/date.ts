import { format, parseISO, startOfDay, endOfDay, subDays, addDays, isAfter, isBefore } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export function nowInZone(tz: string): Date {
  return toZonedTime(new Date(), tz);
}

export function todayKey(tz: string): string {
  return format(nowInZone(tz), 'yyyy-MM-dd');
}

export function previousDayKey(tz: string): string {
  return format(subDays(nowInZone(tz), 1), 'yyyy-MM-dd');
}

export function dayStartUTC(dateKey: string, tz: string): Date {
  const zonedStart = startOfDay(toZonedTime(parseISO(dateKey), tz));
  return fromZonedTime(zonedStart, tz);
}

export function dayEndUTC(dateKey: string, tz: string): Date {
  const zonedEnd = endOfDay(toZonedTime(parseISO(dateKey), tz));
  return fromZonedTime(zonedEnd, tz);
}

/** Returns YYYY-MM-DD keys for the Thu–Wed window ending on the most recent Wednesday. */
export function getThursdayToWednesdayWindow(tz: string): { start: string; end: string } {
  const today = nowInZone(tz);
  const dow = today.getDay(); // 0=Sun, 1=Mon ... 4=Thu, 3=Wed
  // Find most recent Wednesday (day 3)
  const daysToWed = (dow - 3 + 7) % 7;
  const lastWed = subDays(today, daysToWed);
  const lastThu = subDays(lastWed, 6);
  return {
    start: format(lastThu, 'yyyy-MM-dd'),
    end:   format(lastWed, 'yyyy-MM-dd'),
  };
}

export function dueSoonCutoff(tz: string): string {
  return format(addDays(nowInZone(tz), 3), 'yyyy-MM-dd');
}

export function isStale(isoTimestamp: string | null, thresholdMs: number): boolean {
  if (!isoTimestamp) return true;
  return isAfter(new Date(), new Date(new Date(isoTimestamp).getTime() + thresholdMs));
}

export function isoNow(): string {
  return new Date().toISOString();
}

/** e.g. "2026-W12" */
export function weekKey(dateKey: string): string {
  const d = parseISO(dateKey);
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const weekNum = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(weekNum).padStart(2, '0')}`;
}
