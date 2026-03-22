import { NextRequest, NextResponse } from 'next/server';
import { getCalendarDays, buildGCalClient } from '../../lib/gcal';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') ?? '5', 10);

  const client = buildGCalClient();
  if (!client) {
    return NextResponse.json(
      { error: 'Google Calendar not configured. Set GCAL_SERVICE_ACCOUNT_JSON env var.' },
      { status: 503 }
    );
  }

  try {
    const groups = await getCalendarDays(client, days);
    return NextResponse.json(groups);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
