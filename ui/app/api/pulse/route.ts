import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REPO_ROOT = join(process.cwd(), '..');

export async function GET() {
  try {
    const filePath = join(REPO_ROOT, 'pulse', 'master', 'customer-pulse-master.md');

    if (!existsSync(filePath)) {
      return NextResponse.json({ content: null, exists: false });
    }

    const content = readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content, exists: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
