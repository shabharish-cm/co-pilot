import { NextRequest, NextResponse } from 'next/server';
import { completeTask } from '../../../../../lib/todoist';

const TOKEN = process.env.TODOIST_API_TOKEN ?? '';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!TOKEN) {
    return NextResponse.json({ error: 'TODOIST_API_TOKEN not configured' }, { status: 503 });
  }

  const { id } = await params;
  try {
    await completeTask(TOKEN, id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
