/**
 * @deprecated Phase 4 — 2026-03-24
 * Raw GCal API types for the service-account integration. No longer used.
 * Calendar data now comes from the claude.ai Google Calendar MCP server.
 * Scheduled for deletion in Phase 5 (~2026-04-24).
 */

/** Raw Google Calendar API shapes */
export interface GCalDateTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

export interface GCalAttendee {
  email: string;
  displayName?: string;
  responseStatus?: string;
}

export interface GCalEvent {
  id: string;
  summary: string;
  description?: string;
  start: GCalDateTime;
  end: GCalDateTime;
  attendees?: GCalAttendee[];
  hangoutLink?: string;
  status: string;
}

export interface GCalEventListResponse {
  items: GCalEvent[];
  nextPageToken?: string;
}
