/**
 * @deprecated Phase 4 — 2026-03-24
 * Manual test utility for the service-account GCal integration.
 * No longer needed — calendar access is via the claude.ai GCal MCP server.
 * Scheduled for deletion in Phase 5 (~2026-04-24).
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: true });
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';

async function main() {
  const sa = JSON.parse(process.env.GCAL_SERVICE_ACCOUNT_JSON!);
  console.log('SA email:', sa.client_email);
  console.log('User email:', process.env.GCAL_USER_EMAIL);

  const auth = new GoogleAuth({
    credentials: sa,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    clientOptions: { subject: process.env.GCAL_USER_EMAIL },
  });

  try {
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    console.log('Token OK:', token?.substring(0, 30) + '...');

    const calId = encodeURIComponent(process.env.GCAL_CALENDAR_ID || 'primary');
    const res = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calId}/events`, {
      headers: { Authorization: 'Bearer ' + token },
      params: { timeMin: '2026-03-20T00:00:00Z', timeMax: '2026-03-20T23:59:59Z', singleEvents: true },
    });
    console.log('Events count:', res.data.items?.length);
    for (const e of (res.data.items ?? [])) {
      console.log(' -', e.summary, e.start?.dateTime ?? e.start?.date);
    }
  } catch (e: any) {
    console.error('Error:', e.message);
    if (e.response?.data) console.error('Response data:', JSON.stringify(e.response.data, null, 2));
  }
}

main();
