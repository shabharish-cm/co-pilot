/**
 * Backfill transcripts from a Slack workspace export (no API calls, no rate limits).
 *
 * HOW TO GET THE EXPORT:
 *   1. Go to https://slack.com/services/export
 *   2. Select "All time" (or choose a date range)
 *   3. Download the zip — it contains one JSON file per day per channel:
 *        export/cs-call-summary/2025-09-18.json
 *        export/demo-summary/2025-09-18.json
 *   4. Unzip to any folder, e.g. ~/Downloads/slack-export
 *
 * USAGE:
 *   npm run backfill:from-export -- --export-dir ~/Downloads/slack-export
 *   npm run backfill:from-export -- --export-dir ~/Downloads/slack-export --channels cs-call-summary,demo-summary
 *
 * The --channels flag matches folder names inside the export directory.
 * Defaults to: cs-call-summary, demo-summary
 *
 * Idempotent: days where pulse/normalized/<date>-transcripts.json already exists are skipped.
 */

import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';
import { PATHS } from '../config/paths';
import { extractFirefliesIds } from '../integrations/slack/extractor';
import { FirefliesClient } from '../integrations/fireflies/client';
import { mapFirefliesTranscript, deduplicateTranscripts } from '../integrations/fireflies/mapper';
import { readJSON, writeJSON, fileExists } from '../utils/file';
import { logger } from '../utils/logger';
import type { SlackMessage } from '../integrations/slack/types';
import type { TranscriptIndex, TranscriptIndexEntry } from '../types/daily';
import type { NormalizedTranscriptFile } from '../types/transcript';
import type { FirefliesTranscript } from '../integrations/fireflies/types';

const RATE_LIMIT_MS = 400;

// ── Arg parsing ───────────────────────────────────────────────────────────────

function getArg(flag: string): string | null {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

const exportDir   = getArg('--export-dir');
const channelsArg = getArg('--channels');
const CHANNELS    = channelsArg
  ? channelsArg.split(',').map(s => s.trim())
  : ['cs-call-summary', 'demo-summary'];

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// ── Export reader ─────────────────────────────────────────────────────────────

/**
 * Read all day files from the export directory for the given channels.
 * Returns a map of { dayKey → SlackMessage[] } with messages from all channels merged.
 */
function readExportMessages(exportRoot: string): Map<string, SlackMessage[]> {
  const byDay = new Map<string, SlackMessage[]>();

  for (const channel of CHANNELS) {
    const channelDir = path.join(exportRoot, channel);
    if (!fs.existsSync(channelDir)) {
      console.warn(`  ⚠  Channel folder not found: ${channelDir}`);
      continue;
    }

    const files = fs.readdirSync(channelDir)
      .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort(); // chronological

    for (const file of files) {
      const dayKey = file.replace('.json', '');
      const raw = fs.readFileSync(path.join(channelDir, file), 'utf8');

      let messages: SlackMessage[];
      try {
        messages = JSON.parse(raw) as SlackMessage[];
      } catch {
        console.warn(`  ⚠  Failed to parse ${channelDir}/${file}`);
        continue;
      }

      const existing = byDay.get(dayKey) ?? [];
      byDay.set(dayKey, [...existing, ...messages]);
    }
  }

  return byDay;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run(): Promise<void> {
  if (!exportDir) {
    console.error('✗ --export-dir is required\n  Example: npm run backfill:from-export -- --export-dir ~/Downloads/slack-export');
    process.exit(1);
  }

  const resolvedDir = exportDir.replace(/^~/, process.env.HOME ?? '');
  if (!fs.existsSync(resolvedDir)) {
    console.error(`✗ Export directory not found: ${resolvedDir}`);
    process.exit(1);
  }

  if (!ENV.fireflies.apiKey) {
    console.error('✗ FIREFLIES_API_KEY not set');
    process.exit(1);
  }

  console.log(`\n━━━ Transcript Backfill from Slack Export ━━━`);
  console.log(`  Export dir: ${resolvedDir}`);
  console.log(`  Channels:   ${CHANNELS.join(', ')}\n`);

  const fireflies = new FirefliesClient(ENV.fireflies.apiKey);
  const index = readJSON<TranscriptIndex>(PATHS.state.transcriptIndex)
    ?? { lastUpdatedAt: null, entries: [] };

  // Read all messages from the export
  const byDay = readExportMessages(resolvedDir);
  const dayKeys = [...byDay.keys()].sort(); // oldest first

  console.log(`  Found ${dayKeys.length} days across channels\n`);

  let daysSkipped   = 0;
  let daysProcessed = 0;
  let totalIds      = 0;
  let totalFetched  = 0;
  let totalFailed   = 0;
  let totalNorm     = 0;

  for (const dayKey of dayKeys) {
    const normPath = path.join(PATHS.pulse.normalized, `${dayKey}-transcripts.json`);

    if (fileExists(normPath)) {
      console.log(`  ⏭  ${dayKey}  (already exists — skipping)`);
      daysSkipped++;
      continue;
    }

    const messages = byDay.get(dayKey)!;
    const ids = extractFirefliesIds(messages);

    if (ids.length === 0) {
      console.log(`  ·  ${dayKey}  no Fireflies URLs`);
      continue;
    }

    console.log(`  ↓  ${dayKey}  found ${ids.length} transcript(s)`);
    totalIds += ids.length;

    const rawTranscripts: FirefliesTranscript[] = [];

    for (const id of ids) {
      await sleep(RATE_LIMIT_MS);
      try {
        const t = await fireflies.getTranscriptById(id);
        if (t) {
          rawTranscripts.push(t);
          totalFetched++;
          console.log(`     ✓  ${t.title ?? id}`);
        } else {
          console.log(`     ⚠  ${id}  not found (null)`);
          totalFailed++;
        }
      } catch (err) {
        console.log(`     ✗  ${id}  ${(err as Error).message}`);
        totalFailed++;
      }
    }

    if (rawTranscripts.length === 0) {
      daysProcessed++;
      continue;
    }

    // Normalize and write
    const normalized = deduplicateTranscripts(
      rawTranscripts.map(t => mapFirefliesTranscript(t, dayKey)),
    );

    const rawPath = path.join(PATHS.pulse.raw, `${dayKey}-fireflies.json`);
    writeJSON(rawPath, { dayKey, fetchedAt: new Date().toISOString(), source: 'slack-export', transcripts: rawTranscripts });
    writeJSON(normPath, { dayKey, generatedAt: new Date().toISOString(), transcripts: normalized } as NormalizedTranscriptFile);

    const existingIdx = index.entries.findIndex((e: TranscriptIndexEntry) => e.dayKey === dayKey);
    const entry: TranscriptIndexEntry = {
      dayKey,
      filePath: normPath,
      transcriptCount: normalized.length,
      fetchedAt: new Date().toISOString(),
    };
    if (existingIdx >= 0) index.entries[existingIdx] = entry;
    else index.entries.push(entry);

    totalNorm += normalized.length;
    daysProcessed++;
  }

  index.entries.sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  index.lastUpdatedAt = new Date().toISOString();
  writeJSON(PATHS.state.transcriptIndex, index);

  console.log(`
━━━ Backfill complete ━━━

  Days in export:    ${dayKeys.length}
  Days with calls:   ${daysProcessed}
  Days skipped:      ${daysSkipped} (already existed)
  Transcript IDs:    ${totalIds}
  Fetched:           ${totalFetched}
  Failed/not found:  ${totalFailed}
  Normalized total:  ${totalNorm}

Next: run /pulse to synthesize transcripts into Customer Pulse Master.
`);
}

run().catch(err => {
  logger.error('Backfill fatal error', err);
  process.exit(1);
});
