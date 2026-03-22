// GCal API helper — replicated from scripts/integrations/gcal/client.ts

import { GoogleAuth } from 'google-auth-library';
import type { GCalEvent, GCalDayGroup } from './types';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { addDays, startOfDay, endOfDay, format } from 'date-fns';

const BASE_URL = 'https://www.googleapis.com/calendar/v3';
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

interface GCalClientOpts {
  serviceAccountJson: object;
  calendarId: string;
  userEmail?: string;
}

async function getAccessToken(opts: GCalClientOpts): Promise<string> {
  const auth = new GoogleAuth({
    credentials: opts.serviceAccountJson,
    scopes: SCOPES,
    ...(opts.userEmail ? { clientOptions: { subject: opts.userEmail } } : {}),
  });
  const client = await auth.getClient();
  const { token } = await (client as any).getAccessToken();
  if (!token) throw new Error('GCal: failed to obtain access token');
  return token;
}

async function fetchEventsForRange(
  opts: GCalClientOpts,
  token: string,
  timeMin: string,
  timeMax: string,
): Promise<GCalEvent[]> {
  const events: GCalEvent[] = [];
  let pageToken: string | undefined;
  const calId = encodeURIComponent(opts.calendarId);

  do {
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250',
      ...(pageToken ? { pageToken } : {}),
    });

    const res = await fetch(`${BASE_URL}/calendars/${calId}/events?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`GCal events fetch failed: ${res.status}`);
    const data = await res.json();
    events.push(...(data.items ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return events.filter((e: GCalEvent) => e.status !== 'cancelled');
}

export async function getCalendarDays(
  opts: GCalClientOpts,
  days: number = 5,
): Promise<GCalDayGroup[]> {
  const token = await getAccessToken(opts);
  const tz = 'Asia/Kolkata';
  const now = toZonedTime(new Date(), tz);
  const today = startOfDay(now);

  const groups: GCalDayGroup[] = [];

  for (let i = 0; i < days; i++) {
    const dayStart = addDays(today, i);
    const dayEnd = endOfDay(dayStart);

    // Convert to UTC ISO strings for the API
    const timeMin = dayStart.toISOString();
    const timeMax = dayEnd.toISOString();

    const events = await fetchEventsForRange(opts, token, timeMin, timeMax);
    const dateStr = format(dayStart, 'yyyy-MM-dd');
    const label = i === 0 ? 'TODAY' : formatInTimeZone(dayStart, tz, 'EEE, MMM d').toUpperCase();

    groups.push({ date: dateStr, label, events });
  }

  return groups;
}

export function buildGCalClient() {
  const raw = process.env.GCAL_SERVICE_ACCOUNT_JSON;
  const calendarId = process.env.GCAL_CALENDAR_ID ?? 'primary';
  const userEmail = process.env.GCAL_USER_EMAIL;

  if (!raw) return null;

  try {
    const serviceAccountJson = JSON.parse(raw);
    return { serviceAccountJson, calendarId, userEmail };
  } catch {
    return null;
  }
}
