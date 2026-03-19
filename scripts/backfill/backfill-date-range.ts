/**
 * Date-range backfill: fetches all Fireflies transcripts for the past N months
 * using getTranscripts(fromDate, toDate) — one API call per month chunk.
 *
 * With a 10 calls/hr rate limit, 6 months = 6 API calls (vs. hundreds of
 * per-ID calls in the original backfill-transcripts.ts).
 *
 * Usage:
 *   npm run backfill:date-range
 *   npm run backfill:date-range -- --months 6    (default)
 *   npm run backfill:date-range -- --months 3
 *
 * Idempotent: already-written normalized files are skipped.
 */

import path from 'path';
import { format, subMonths, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ENV } from '../config/env';
import { PATHS } from '../config/paths';
import { FirefliesClient } from '../integrations/fireflies/client';
import { mapFirefliesTranscript, deduplicateTranscripts } from '../integrations/fireflies/mapper';
import { readJSON, writeJSON, fileExists } from '../utils/file';
import { logger } from '../utils/logger';
import type { TranscriptIndex, TranscriptIndexEntry } from '../types/daily';
import type { NormalizedTranscriptFile } from '../types/transcript';
import type { FirefliesTranscript } from '../integrations/fireflies/types';

// ── Config ────────────────────────────────────────────────────────────────────

const MONTHS_BACK       = parseMonthsArg() ?? 6;
const INTER_CHUNK_MS    = 2000; // delay between monthly API calls
const TZ                = ENV.timezone;

function parseMonthsArg(): number | null {
  const idx = process.argv.indexOf('--months');
  if (idx === -1) return null;
  const val = parseInt(process.argv[idx + 1], 10);
  return isNaN(val) ? null : val;
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// ── Month chunks ──────────────────────────────────────────────────────────────

interface MonthChunk {
  label: string;   // e.g. "2025-09"
  from:  Date;
  to:    Date;
}

function buildMonthChunks(monthsBack: number): MonthChunk[] {
  const now    = toZonedTime(new Date(), TZ);
  const chunks: MonthChunk[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const from = fromZonedTime(startOfMonth(toZonedTime(monthDate, TZ)), TZ);
    const to   = i === 0
      ? new Date()  // current month: up to now
      : fromZonedTime(endOfMonth(toZonedTime(monthDate, TZ)), TZ);

    chunks.push({
      label: format(monthDate, 'yyyy-MM'),
      from,
      to,
    });
  }

  return chunks;
}

// ── Day key from transcript date ──────────────────────────────────────────────

function dayKeyFromTimestamp(dateMs: number): string {
  // date field is Unix ms; convert to local date string
  const zoned = toZonedTime(new Date(dateMs), TZ);
  return format(zoned, 'yyyy-MM-dd');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run(): Promise<void> {
  console.log(`\n━━━ Fireflies Date-Range Backfill — past ${MONTHS_BACK} months ━━━\n`);

  if (!ENV.fireflies.apiKey) {
    console.error('✗ FIREFLIES_API_KEY not set');
    process.exit(1);
  }

  const fireflies = new FirefliesClient(ENV.fireflies.apiKey);
  const chunks    = buildMonthChunks(MONTHS_BACK);

  const index = readJSON<TranscriptIndex>(PATHS.state.transcriptIndex)
    ?? { lastUpdatedAt: null, entries: [] };

  // Collect all raw transcripts grouped by dayKey
  const byDay = new Map<string, FirefliesTranscript[]>();

  let totalApiCalls = 0;
  let totalFetched  = 0;
  let totalFailed   = 0;

  // ── Fetch phase: one API call per month ────────────────────────────────────
  for (const chunk of chunks) {
    if (totalApiCalls > 0) await sleep(INTER_CHUNK_MS);

    console.log(`  ↓  ${chunk.label}  (${chunk.from.toISOString().slice(0,10)} → ${chunk.to.toISOString().slice(0,10)})`);

    try {
      const transcripts = await fireflies.getTranscripts(chunk.from, chunk.to);
      totalApiCalls++;
      totalFetched += transcripts.length;
      console.log(`     ✓  ${transcripts.length} transcript(s)`);

      for (const t of transcripts) {
        const dayKey = dayKeyFromTimestamp(t.date);
        if (!byDay.has(dayKey)) byDay.set(dayKey, []);
        byDay.get(dayKey)!.push(t);
      }
    } catch (err) {
      totalApiCalls++;
      totalFailed++;
      console.log(`     ✗  ${chunk.label}  fetch failed — ${(err as Error).message}`);
    }
  }

  console.log(`\n  API calls used: ${totalApiCalls}  |  transcripts fetched: ${totalFetched}  |  failed chunks: ${totalFailed}\n`);

  // ── Write phase: one file per day ──────────────────────────────────────────
  let daysWritten  = 0;
  let daysSkipped  = 0;
  let totalNormalized = 0;

  const sortedDays = [...byDay.keys()].sort();

  for (const dayKey of sortedDays) {
    const normPath = path.join(PATHS.pulse.normalized, `${dayKey}-transcripts.json`);

    if (fileExists(normPath)) {
      console.log(`  ⏭  ${dayKey}  (already exists — skipping)`);
      daysSkipped++;
      continue;
    }

    const rawTranscripts = byDay.get(dayKey)!;
    const normalized     = deduplicateTranscripts(
      rawTranscripts.map(t => mapFirefliesTranscript(t, dayKey)),
    );

    const rawPath = path.join(PATHS.pulse.raw, `${dayKey}-fireflies.json`);
    writeJSON(rawPath, {
      dayKey,
      fetchedAt: new Date().toISOString(),
      source: 'backfill-date-range',
      transcripts: rawTranscripts,
    });

    const normalizedFile: NormalizedTranscriptFile = {
      dayKey,
      generatedAt: new Date().toISOString(),
      transcripts: normalized,
    };
    writeJSON(normPath, normalizedFile);

    // Update index
    const existingIdx = index.entries.findIndex((e: TranscriptIndexEntry) => e.dayKey === dayKey);
    const entry: TranscriptIndexEntry = {
      dayKey,
      filePath: normPath,
      transcriptCount: normalized.length,
      fetchedAt: new Date().toISOString(),
    };
    if (existingIdx >= 0) index.entries[existingIdx] = entry;
    else index.entries.push(entry);

    console.log(`  ✓  ${dayKey}  ${normalized.length} transcript(s)`);
    totalNormalized += normalized.length;
    daysWritten++;
  }

  // Persist updated index
  index.entries.sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  index.lastUpdatedAt = new Date().toISOString();
  writeJSON(PATHS.state.transcriptIndex, index);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`
━━━ Backfill complete ━━━

  API calls used:    ${totalApiCalls} / 10 per hour
  Transcripts raw:   ${totalFetched}
  Days with calls:   ${sortedDays.length}
  Days written:      ${daysWritten}
  Days skipped:      ${daysSkipped} (already existed)
  Normalized total:  ${totalNormalized}

Next step: run /pulse to synthesize transcripts into the Customer Pulse Master doc.
`);
}

run().catch(err => {
  logger.error('Backfill fatal error', err);
  process.exit(1);
});
