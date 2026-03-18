import fs from 'fs';
import path from 'path';
import { logger } from './logger';

/** Read and parse a JSON file. Returns null if file does not exist. */
export function readJSON<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

/** Write JSON atomically: write to tmp file, then rename. */
export function writeJSON(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, filePath);
  logger.debug('writeJSON', { filePath });
}

/** Read a markdown file. Returns null if not found. */
export function readMarkdown(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

/** Write markdown, creating parent dirs as needed. */
export function writeMarkdown(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  logger.debug('writeMarkdown', { filePath });
}

/** Append text to an existing markdown file (or create it). */
export function appendMarkdown(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(filePath, content, 'utf-8');
}

/** List files in a directory matching a suffix. Returns [] if dir missing. */
export function listFiles(dir: string, suffix: string): string[] {
  try {
    return fs.readdirSync(dir)
      .filter(f => f.endsWith(suffix))
      .map(f => path.join(dir, f))
      .sort();
  } catch {
    return [];
  }
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
