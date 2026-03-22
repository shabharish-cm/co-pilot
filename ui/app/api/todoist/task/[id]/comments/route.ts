import { NextRequest, NextResponse } from 'next/server';
import { getComments, addComment } from '../../../../../lib/todoist';

const TOKEN = process.env.TODOIST_API_TOKEN ?? '';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!TOKEN) {
    return NextResponse.json({ error: 'TODOIST_API_TOKEN not configured' }, { status: 503 });
  }

  const { id } = await params;
  try {
    const comments = await getComments(TOKEN, id);
    return NextResponse.json(comments);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!TOKEN) {
    return NextResponse.json({ error: 'TODOIST_API_TOKEN not configured' }, { status: 503 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const { content } = body;
    if (!content?.trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }
    const comment = await addComment(TOKEN, id, content.trim());
    return NextResponse.json(comment);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
