/**
 * Pulse workflow tests.
 * Covers Scenario D (recurrence detection), Scenario E (/pulse with no transcripts).
 */
import os from 'os';
import path from 'path';
import fs from 'fs';
import { writeJSON, readJSON, writeMarkdown } from '../../../scripts/utils/file';
import { weekKey } from '../../../scripts/utils/date';
import type { NormalizedTranscriptFile } from '../../../scripts/types/transcript';

const tmpDir = path.join(os.tmpdir(), 'pm-copilot-pulse-tests');

beforeAll(() => fs.mkdirSync(tmpDir, { recursive: true }));
afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

function makeTranscriptFile(dayKey: string, titles: string[]): NormalizedTranscriptFile {
  return {
    dayKey,
    generatedAt: new Date().toISOString(),
    transcripts: titles.map((title, i) => ({
      transcriptId: `tx_${dayKey}_${i}`,
      meetingTitle: title,
      meetingDate: new Date().toISOString(),
      participants: ['Alice', 'Bob'],
      summary: `Summary for ${title}`,
      transcriptText: `Customer said: We really need ${title}`,
      sourceUrl: 'https://fireflies.ai/view/test',
      fetchedAt: new Date().toISOString(),
      sourceDay: dayKey,
    })),
  };
}

// Helper: collect transcript files for a window
function collectTranscriptFiles(normalizedDir: string, start: string, end: string): NormalizedTranscriptFile[] {
  const files = fs.readdirSync(normalizedDir)
    .filter(f => f.endsWith('-transcripts.json'))
    .sort();
  return files
    .filter(f => {
      const day = f.replace('-transcripts.json', '');
      return day >= start && day <= end;
    })
    .map(f => readJSON<NormalizedTranscriptFile>(path.join(normalizedDir, f))!);
}

describe('Scenario D — pulse recurrence detection', () => {
  const normalizedDir = path.join(tmpDir, 'normalized');
  fs.mkdirSync(normalizedDir, { recursive: true });

  beforeAll(() => {
    // Write transcripts for two weeks
    writeJSON(path.join(normalizedDir, '2026-03-10-transcripts.json'),
      makeTranscriptFile('2026-03-10', ['Export to CSV', 'Better filters']));
    writeJSON(path.join(normalizedDir, '2026-03-17-transcripts.json'),
      makeTranscriptFile('2026-03-17', ['Export to CSV', 'Dashboard improvements']));
  });

  test('collects transcripts within window', () => {
    const files = collectTranscriptFiles(normalizedDir, '2026-03-17', '2026-03-18');
    expect(files).toHaveLength(1);
    expect(files[0].dayKey).toBe('2026-03-17');
  });

  test('total transcript count matches across window', () => {
    const files = collectTranscriptFiles(normalizedDir, '2026-03-10', '2026-03-17');
    const total = files.reduce((sum, f) => sum + f.transcripts.length, 0);
    expect(total).toBe(4);
  });

  test('can detect a recurring title across weeks', () => {
    const week1 = collectTranscriptFiles(normalizedDir, '2026-03-10', '2026-03-10');
    const week2 = collectTranscriptFiles(normalizedDir, '2026-03-17', '2026-03-17');

    const week1Titles = new Set(week1.flatMap(f => f.transcripts.map(t => t.meetingTitle)));
    const week2Titles = week2.flatMap(f => f.transcripts.map(t => t.meetingTitle));

    const recurring = week2Titles.filter(t => week1Titles.has(t));
    expect(recurring).toContain('Export to CSV');
    expect(recurring).not.toContain('Dashboard improvements');
  });
});

// Scenario E — /pulse with no transcripts for window
describe('Scenario E — /pulse no transcripts', () => {
  const emptyDir = path.join(tmpDir, 'empty-normalized');
  fs.mkdirSync(emptyDir, { recursive: true });

  test('returns empty array when no files match window', () => {
    const files = collectTranscriptFiles(emptyDir, '2026-03-10', '2026-03-17');
    expect(files).toHaveLength(0);
  });

  test('empty array triggers early-exit condition', () => {
    const files = collectTranscriptFiles(emptyDir, '2026-03-10', '2026-03-17');
    // Simulates: if no files, /pulse should stop, not fabricate
    const shouldProceed = files.length > 0;
    expect(shouldProceed).toBe(false);
  });
});
