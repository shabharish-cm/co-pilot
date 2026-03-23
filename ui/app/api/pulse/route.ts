import { NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const REPO_ROOT = join(process.cwd(), '..');

export async function GET() {
  try {
    const weeklyDir = join(REPO_ROOT, 'pulse', 'weekly');

    // Find the most recent weekly digest
    if (existsSync(weeklyDir)) {
      const files = readdirSync(weeklyDir)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse();

      if (files.length > 0) {
        const latest = files[0];
        const content = readFileSync(join(weeklyDir, latest), 'utf-8');
        return NextResponse.json({
          content,
          exists: true,
          filename: latest,
          // e.g. "2026-W12.md" → "W12 · 2026"
          label: latest.replace('.md', '').replace('-customer-pulse', ''),
        });
      }
    }

    return NextResponse.json({ content: null, exists: false, filename: null, label: null });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
