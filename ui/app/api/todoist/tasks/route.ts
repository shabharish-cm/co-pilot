import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask, enrichTask } from '../../../lib/todoist';
import { routeTask } from '../../../lib/routing';

const TOKEN = process.env.TODOIST_API_TOKEN ?? '';

export async function GET() {
  if (!TOKEN) {
    return NextResponse.json({ error: 'TODOIST_API_TOKEN not configured' }, { status: 503 });
  }

  try {
    const tasks = await getTasks(TOKEN);
    const enriched = tasks.map(enrichTask);
    return NextResponse.json(enriched);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({ error: 'TODOIST_API_TOKEN not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { content, description, due_date, priority, labels, section_id } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    // Run routing if no section_id provided
    const routing = section_id ? null : routeTask(content, labels ?? []);
    const resolvedSectionId = section_id ?? routing?.sectionId;

    const task = await createTask(TOKEN, {
      content: content.trim(),
      description,
      due_date,
      priority,
      labels,
      section_id: resolvedSectionId,
    });

    const enriched = enrichTask(task);
    return NextResponse.json({ task: enriched, routing });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
