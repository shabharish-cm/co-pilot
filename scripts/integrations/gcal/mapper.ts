/**
 * @deprecated Phase 4 — 2026-03-24
 * mapGCalEvent is no longer used. Meeting data now comes directly from the
 * claude.ai Google Calendar MCP server (gcal_list_events) inside /morning.
 * Scheduled for deletion in Phase 5 (~2026-04-24).
 */
import { MeetingRecord } from '../../types/daily';
import type { GCalEvent } from './types';

export function mapGCalEvent(raw: GCalEvent): MeetingRecord {
  const startTime = raw.start.dateTime ?? raw.start.date ?? '';
  const endTime   = raw.end.dateTime   ?? raw.end.date   ?? '';
  return {
    id:          raw.id,
    title:       raw.summary ?? '(no title)',
    startTime,
    endTime,
    attendees:   (raw.attendees ?? []).map(a => a.displayName ?? a.email),
    meetLink:    raw.hangoutLink,
    description: raw.description,
  };
}
