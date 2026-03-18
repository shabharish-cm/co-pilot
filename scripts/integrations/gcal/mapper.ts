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
