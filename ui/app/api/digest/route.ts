import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { formatInTimeZone } from 'date-fns-tz';

const IST = 'Asia/Kolkata';
const REPO_ROOT = join(process.cwd(), '..');

export async function GET() {
  try {
    const now = new Date();
    const dateStr = formatInTimeZone(now, IST, 'yyyy-MM-dd');
    const digestDir = join(REPO_ROOT, 'daily', 'digests');
    const fileName = `${dateStr}-morning.md`;
    const filePath = join(digestDir, fileName);

    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      return NextResponse.json({ content, exists: true, date: dateStr, stale: false });
    }

    // Fall back to most recent morning digest available
    if (existsSync(digestDir)) {
      const files = readdirSync(digestDir)
        .filter(f => f.endsWith('-morning.md'))
        .sort()
        .reverse();
      if (files.length > 0) {
        const recent = files[0];
        const recentDate = recent.replace('-morning.md', '');
        const content = readFileSync(join(digestDir, recent), 'utf-8');
        return NextResponse.json({ content, exists: true, date: recentDate, stale: true });
      }
      // Also check non-morning files (older format)
      const anyFiles = readdirSync(digestDir).filter(f => f.endsWith('.md')).sort().reverse();
      if (anyFiles.length > 0) {
        const recent = anyFiles[0];
        const recentDate = recent.replace('.md', '');
        const content = readFileSync(join(digestDir, recent), 'utf-8');
        return NextResponse.json({ content, exists: true, date: recentDate, stale: true });
      }
    }

    return NextResponse.json({ content: null, exists: false, date: dateStr });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Called after regeneration to persist the Claude-generated digest to disk
export async function POST(req: NextRequest) {
  try {
    const { rawOutput } = await req.json() as { rawOutput: string };
    if (!rawOutput) return NextResponse.json({ error: 'rawOutput required' }, { status: 400 });

    // Extract the markdown digest block (starts at "# Daily Digest")
    const match = rawOutput.match(/# Daily Digest[\s\S]*/);
    if (!match) return NextResponse.json({ error: 'no digest block found in output' }, { status: 422 });

    const content = match[0].trim();
    const now = new Date();
    const dateStr = formatInTimeZone(now, IST, 'yyyy-MM-dd');
    const digestDir = join(REPO_ROOT, 'daily', 'digests');
    mkdirSync(digestDir, { recursive: true });
    const filePath = join(digestDir, `${dateStr}-morning.md`);
    writeFileSync(filePath, content, 'utf-8');

    return NextResponse.json({ success: true, path: filePath, date: dateStr });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
