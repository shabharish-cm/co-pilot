import { NextRequest, NextResponse } from 'next/server';
import { updateTask, enrichTask } from '../../../../lib/todoist';
import { refreshCurrentDayState } from '../../../../lib/state';

const TOKEN = process.env.TODOIST_API_TOKEN ?? '';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!TOKEN) {
    return NextResponse.json({ error: 'TODOIST_API_TOKEN not configured' }, { status: 503 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const { content, description, labels, section_id, due_date, priority } = body;

    const payload: Record<string, unknown> = {};
    if (content !== undefined) payload.content = content;
    if (description !== undefined) payload.description = description;
    if (labels !== undefined) payload.labels = labels;
    if (section_id !== undefined) payload.section_id = section_id;
    if (priority !== undefined) payload.priority = priority;
    // Handle due date — null clears it
    if (due_date !== undefined) {
      if (due_date === null || due_date === '') {
        payload.due_string = 'no date';
      } else {
        payload.due_date = due_date;
      }
    }

    const updated = await updateTask(TOKEN, id, payload as Parameters<typeof updateTask>[2]);
    refreshCurrentDayState(TOKEN).catch(() => {});
    return NextResponse.json(enrichTask(updated));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
