import os from 'os';
import path from 'path';
import fs from 'fs';
import { readJSON, writeJSON, readMarkdown, writeMarkdown, listFiles, fileExists } from '../../../scripts/utils/file';

const tmpDir = path.join(os.tmpdir(), 'pm-copilot-tests');

beforeAll(() => fs.mkdirSync(tmpDir, { recursive: true }));
afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

describe('file utils', () => {
  test('writeJSON and readJSON round-trip', () => {
    const p = path.join(tmpDir, 'test.json');
    writeJSON(p, { foo: 'bar', n: 42 });
    expect(readJSON(p)).toEqual({ foo: 'bar', n: 42 });
  });

  test('readJSON returns null for missing file', () => {
    expect(readJSON(path.join(tmpDir, 'nonexistent.json'))).toBeNull();
  });

  test('writeMarkdown and readMarkdown round-trip', () => {
    const p = path.join(tmpDir, 'test.md');
    writeMarkdown(p, '# Hello\nworld');
    expect(readMarkdown(p)).toBe('# Hello\nworld');
  });

  test('readMarkdown returns null for missing file', () => {
    expect(readMarkdown(path.join(tmpDir, 'missing.md'))).toBeNull();
  });

  test('listFiles returns matching files', () => {
    writeJSON(path.join(tmpDir, '2026-01-01-morning.json'), {});
    writeJSON(path.join(tmpDir, '2026-01-02-morning.json'), {});
    const files = listFiles(tmpDir, '-morning.json');
    expect(files.length).toBeGreaterThanOrEqual(2);
  });

  test('listFiles returns [] for missing dir', () => {
    expect(listFiles('/nonexistent/dir', '.json')).toEqual([]);
  });

  test('fileExists returns true and false correctly', () => {
    const p = path.join(tmpDir, 'exists.json');
    writeJSON(p, {});
    expect(fileExists(p)).toBe(true);
    expect(fileExists(path.join(tmpDir, 'nope.json'))).toBe(false);
  });
});
