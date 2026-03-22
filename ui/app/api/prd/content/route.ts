import { NextResponse, NextRequest } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const REPO_ROOT = join(process.cwd(), '..');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const relPath = searchParams.get('path');

    if (!relPath) {
      return NextResponse.json({ error: 'path param required' }, { status: 400 });
    }

    // Security: prevent path traversal
    const normalized = relPath.replace(/\.\.\//g, '').replace(/\.\./g, '');
    const filePath = join(REPO_ROOT, normalized);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const ext = extname(filePath).toLowerCase();

    if (ext === '.docx') {
      return NextResponse.json({
        content: null,
        type: 'docx',
        filename: basename(filePath),
      });
    }

    const content = readFileSync(filePath, 'utf-8');

    if (ext === '.md') {
      return NextResponse.json({ content, type: 'md' });
    }

    if (ext === '.html' || ext === '.htm') {
      return NextResponse.json({ content, type: 'html' });
    }

    return NextResponse.json({ content, type: 'other' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
