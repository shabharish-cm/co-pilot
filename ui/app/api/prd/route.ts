import { NextResponse } from 'next/server';
import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const REPO_ROOT = join(process.cwd(), '..');
const PRDS_DIR = join(REPO_ROOT, 'PRDs');

export async function GET() {
  try {
    if (!existsSync(PRDS_DIR)) {
      return NextResponse.json([]);
    }

    const entries = readdirSync(PRDS_DIR);
    const folders: { name: string; fileCount: number }[] = [];

    for (const entry of entries) {
      // Skip hidden entries and Icon files
      if (entry.startsWith('.') || entry === 'Icon') continue;

      const entryPath = join(PRDS_DIR, entry);
      try {
        const stat = statSync(entryPath);
        if (!stat.isDirectory()) continue;

        // Count files (non-hidden, non-Icon)
        let fileCount = 0;
        const children = readdirSync(entryPath);
        for (const child of children) {
          if (child.startsWith('.') || child === 'Icon') continue;
          const childPath = join(entryPath, child);
          const childStat = statSync(childPath);
          if (childStat.isFile()) {
            fileCount++;
          } else if (childStat.isDirectory()) {
            // Count files in subdirectories (e.g. mockups/)
            try {
              const subChildren = readdirSync(childPath);
              for (const sc of subChildren) {
                if (sc.startsWith('.') || sc === 'Icon') continue;
                const scPath = join(childPath, sc);
                const scStat = statSync(scPath);
                if (scStat.isFile()) fileCount++;
              }
            } catch {
              // ignore unreadable subdirs
            }
          }
        }

        folders.push({ name: entry, fileCount });
      } catch {
        // skip entries we can't stat
      }
    }

    // Sort alphabetically
    folders.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(folders);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
