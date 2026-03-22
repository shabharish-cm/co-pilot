import { NextResponse, NextRequest } from 'next/server';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';

const REPO_ROOT = join(process.cwd(), '..');
const PRDS_DIR = join(REPO_ROOT, 'PRDs');

type FileExt = 'md' | 'html' | 'docx' | 'other';

interface FileInfo {
  name: string;
  path: string;
  ext: FileExt;
}

interface CategorisedFiles {
  prd: FileInfo[];
  mockup: FileInfo[];
  research: FileInfo[];
  jtbd: FileInfo[];
}

function getExt(filename: string): FileExt {
  const ext = extname(filename).toLowerCase().slice(1);
  if (ext === 'md') return 'md';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'docx') return 'docx';
  return 'other';
}

function categorise(files: FileInfo[]): CategorisedFiles {
  const result: CategorisedFiles = { prd: [], mockup: [], research: [], jtbd: [] };

  for (const f of files) {
    const lower = f.name.toLowerCase();

    if (f.ext === 'html') {
      result.mockup.push(f);
      continue;
    }

    if (/jtbd|jobs/.test(lower)) {
      result.jtbd.push(f);
      continue;
    }

    if (/prd/.test(lower)) {
      result.prd.push(f);
      continue;
    }

    if (f.ext === 'md' || f.ext === 'docx') {
      result.research.push(f);
      continue;
    }
  }

  // For prd: prefer .md over .docx
  result.prd.sort((a, b) => {
    if (a.ext === 'md' && b.ext !== 'md') return -1;
    if (a.ext !== 'md' && b.ext === 'md') return 1;
    return 0;
  });

  return result;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    if (!folder) {
      return NextResponse.json({ error: 'folder param required' }, { status: 400 });
    }

    const folderPath = join(PRDS_DIR, folder);
    if (!existsSync(folderPath)) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const allFiles: FileInfo[] = [];

    const collectFiles = (dirPath: string, relBase: string) => {
      try {
        const entries = readdirSync(dirPath);
        for (const entry of entries) {
          if (entry.startsWith('.') || entry === 'Icon') continue;
          const entryPath = join(dirPath, entry);
          try {
            const stat = statSync(entryPath);
            if (stat.isFile()) {
              const ext = getExt(entry);
              if (ext === 'other') continue; // skip non-relevant files
              allFiles.push({
                name: entry,
                path: `PRDs/${folder}${relBase}/${entry}`,
                ext,
              });
            } else if (stat.isDirectory()) {
              // Only recurse one level deep (for mockups/ etc)
              collectFiles(entryPath, `${relBase}/${entry}`);
            }
          } catch {
            // skip
          }
        }
      } catch {
        // skip unreadable dir
      }
    };

    collectFiles(folderPath, '');

    const categorised = categorise(allFiles);
    return NextResponse.json(categorised);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
