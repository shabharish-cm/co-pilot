/**
 * @deprecated Phase 4 — 2026-03-24
 * GCalClient is no longer used. Google Calendar is now fetched live via the
 * claude.ai Google Calendar MCP server inside the /morning command.
 * Scheduled for deletion in Phase 5 (~2026-04-24).
 * Do not add new usages of this class.
 */
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { withRetry } from '../../utils/retry';
import type { GCalEvent, GCalEventListResponse } from './types';

const BASE_URL = 'https://www.googleapis.com/calendar/v3';
const SCOPES   = ['https://www.googleapis.com/auth/calendar.readonly'];

export class GCalClient {
  private calendarId: string;
  private auth: GoogleAuth;

  /**
   * @param serviceAccountJson - parsed service account JSON key object
   * @param calendarId         - calendar ID or email address to query
   *
   * The calendar must be shared with the service account's client_email.
   * In Google Calendar: Settings → Share with specific people → add the
   * service account email with "See all event details" permission.
   */
  constructor(opts: { serviceAccountJson: object; calendarId: string; userEmail?: string }) {
    this.calendarId = opts.calendarId;
    this.auth = new GoogleAuth({
      credentials: opts.serviceAccountJson,
      scopes: SCOPES,
      // Impersonate the user so the service account reads their calendar.
      // Requires domain-wide delegation enabled on the service account.
      ...(opts.userEmail ? { clientOptions: { subject: opts.userEmail } } : {}),
    });
  }

  private async getAccessToken(): Promise<string> {
    const client = await this.auth.getClient();
    const { token } = await client.getAccessToken();
    if (!token) throw new Error('GCal: failed to obtain access token from service account');
    return token;
  }

  async getEventsForDay(timeMin: string, timeMax: string): Promise<GCalEvent[]> {
    return withRetry(async () => {
      const token  = await this.getAccessToken();
      const events: GCalEvent[] = [];
      let pageToken: string | undefined;

      do {
        const res = await axios.get<GCalEventListResponse>(
          `${BASE_URL}/calendars/${encodeURIComponent(this.calendarId)}/events`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              timeMin,
              timeMax,
              singleEvents: true,
              orderBy: 'startTime',
              pageToken,
              maxResults: 250,
            },
          },
        );
        events.push(...res.data.items);
        pageToken = res.data.nextPageToken;
      } while (pageToken);

      return events.filter(e => e.status !== 'cancelled');
    }, {}, 'gcal:getEventsForDay');
  }
}
