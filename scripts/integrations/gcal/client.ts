import axios, { AxiosInstance } from 'axios';
import { withRetry } from '../../utils/retry';
import type { GCalEvent, GCalEventListResponse } from './types';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const BASE_URL  = 'https://www.googleapis.com/calendar/v3';

export class GCalClient {
  private calendarId: string;
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private accessToken: string | null = null;

  constructor(opts: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    calendarId: string;
  }) {
    this.clientId     = opts.clientId;
    this.clientSecret = opts.clientSecret;
    this.refreshToken = opts.refreshToken;
    this.calendarId   = opts.calendarId;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    const res = await axios.post<{ access_token: string }>(TOKEN_URL, {
      client_id:     this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type:    'refresh_token',
    });
    this.accessToken = res.data.access_token;
    return this.accessToken;
  }

  private async http(): Promise<AxiosInstance> {
    const token = await this.getAccessToken();
    return axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getEventsForDay(timeMin: string, timeMax: string): Promise<GCalEvent[]> {
    return withRetry(async () => {
      const client = await this.http();
      const events: GCalEvent[] = [];
      let pageToken: string | undefined;

      do {
        const res = await client.get<GCalEventListResponse>(
          `/calendars/${encodeURIComponent(this.calendarId)}/events`,
          {
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
