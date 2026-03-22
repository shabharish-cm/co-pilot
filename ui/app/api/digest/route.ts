import { NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
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
