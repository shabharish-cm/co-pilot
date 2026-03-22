import { NextResponse } from 'next/server';
import { refreshCurrentDayState } from '../../../lib/state';

const TOKEN = process.env.TODOIST_API_TOKEN ?? '';

// Called before digest regeneration to ensure current_day.json
// reflects live Todoist state — catches edits made in the native app
export async function POST() {
  if (!TOKEN) {
    return NextResponse.json({ error: 'TODOIST_API_TOKEN not configured' }, { status: 503 });
  }
  await refreshCurrentDayState(TOKEN);
  return NextResponse.json({ success: true });
}
