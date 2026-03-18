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
