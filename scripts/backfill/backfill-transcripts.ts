/**
 * One-time backfill: reads Fireflies URLs from Slack channels for the past N days,
 * fetches each transcript, and writes normalized files to pulse/normalized/.
 *
 * Usage:
 *   npm run backfill:transcripts
 *   npm run backfill:transcripts -- --days 90     (default)
 *   npm run backfill:transcripts -- --days 30
 *
 * Idempotent: already-written normalized files are skipped.
 * Safe to re-run if interrupted.
 */

import path from 'path';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ENV } from '../config/env';
import { PATHS } from '../config/paths';
import { SlackClient } from '../integrations/slack/client';
import { extractFirefliesIds } from '../integrations/slack/extractor';
import { FirefliesClient } from '../integrations/fireflies/client';
import { mapFirefliesTranscript, deduplicateTranscripts } from '../integrations/fireflies/mapper';
import { readJSON, writeJSON, fileExists } from '../utils/file';
import { logger } from '../utils/logger';
import type { TranscriptIndex, TranscriptIndexEntry } from '../types/daily';
import type { NormalizedTranscriptFile } from '../types/transcript';
import type { FirefliesTranscript } from '../integrations/fireflies/types';

// ── Config ────────────────────────────────────────────────────────────────────

const DAYS_BACK          = parseDaysArg() ?? 90;
const RATE_LIMIT_MS      = 400;   // delay between Fireflies API calls
const SLACK_INTER_CALL_MS = 1500; // delay between Slack API calls → ~40 req/min (limit: 50)
const TZ                 = ENV.timezone;

function parseDaysArg(): number | null {
  const idx = process.argv.indexOf('--days');
  if (idx === -1) return null;
  const val = parseInt(process.argv[idx + 1], 10);
  return isNaN(val) ? null : val;
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// ── Day helpers ───────────────────────────────────────────────────────────────

function dayWindow(dayKey: string): { oldest: number; latest: number } {
  const zoned = toZonedTime(new Date(dayKey + 'T00:00:00'), TZ);
  const start = fromZonedTime(startOfDay(zoned), TZ);
  const end   = fromZonedTime(endOfDay(zoned),   TZ);
  return { oldest: start.getTime() / 1000, latest: end.getTime() / 1000 };
}

function buildDayKeys(daysBack: number): string[] {
  const keys: string[] = [];
  const now = toZonedTime(new Date(), TZ);
  for (let i = 1; i <= daysBack; i++) {
    keys.push(format(subDays(now, i), 'yyyy-MM-dd'));
  }
  return keys.reverse(); // oldest first
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run(): Promise<void> {
  console.log(`\n━━━ Transcript Backfill — past ${DAYS_BACK} days ━━━\n`);

  if (!ENV.slack.botToken)               { console.error('✗ SLACK_BOT_TOKEN not set');               process.exit(1); }
  if (!ENV.slack.csCallSummaryChannelId && !ENV.slack.demoSummaryChannelId) {
    console.error('✗ No Slack channel IDs set — set SLACK_CS_CALL_SUMMARY_CHANNEL_ID or SLACK_DEMO_SUMMARY_CHANNEL_ID');
    process.exit(1);
  }
  if (!ENV.fireflies.apiKey)             { console.error('✗ FIREFLIES_API_KEY not set');             process.exit(1); }

  const slack     = new SlackClient(ENV.slack.botToken);
  const fireflies = new FirefliesClient(ENV.fireflies.apiKey);
  const channelIds = [
    ENV.slack.csCallSummaryChannelId,
    ENV.slack.demoSummaryChannelId,
  ].filter(Boolean);

  const dayKeys = buildDayKeys(DAYS_BACK);

  // Load existing transcript index so we can update it
  const index = readJSON<TranscriptIndex>(PATHS.state.transcriptIndex)
    ?? { lastUpdatedAt: null, entries: [] };

  // ── Stats ──────────────────────────────────────────────────────────────────
  let daysProcessed  = 0;
  let daysSkipped    = 0;
  let totalIds       = 0;
  let totalFetched   = 0;
  let totalFailed    = 0;
  let totalNormalized = 0;

  // ── Process each day ───────────────────────────────────────────────────────
  for (const dayKey of dayKeys) {
    const normPath = path.join(PATHS.pulse.normalized, `${dayKey}-transcripts.json`);

    // Skip if already backfilled
    if (fileExists(normPath)) {
      console.log(`  ⏭  ${dayKey}  (already exists — skipping)`);
      daysSkipped++;
      continue;
    }

    // Fetch Slack messages for this day — sequential across channels to avoid
    // hitting the Slack Tier-3 rate limit (50 req/min). With SLACK_INTER_CALL_MS
    // between each call we stay at ~40 req/min for a 2-channel backfill.
    const { oldest, latest } = dayWindow(dayKey);
    const allMessages: import('../integrations/slack/types').SlackMessage[] = [];
    for (const channelId of channelIds) {
      await sleep(SLACK_INTER_CALL_MS);
      const msgs = await slack.getChannelMessages(channelId, oldest, latest);
      allMessages.push(...msgs);
    }

    const ids = extractFirefliesIds(allMessages);

    if (ids.length === 0) {
      console.log(`  ·  ${dayKey}  no calls`);
      continue;
    }

    console.log(`  ↓  ${dayKey}  found ${ids.length} transcript(s)`);
    totalIds += ids.length;

    // Fetch each transcript from Fireflies with rate limiting
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
          console.log(`     ⚠  ${id}  not found`);
          totalFailed++;
        }
      } catch (err) {
        console.log(`     ✗  ${id}  fetch failed — ${(err as Error).message}`);
        totalFailed++;
      }
    }

    if (rawTranscripts.length === 0) {
      console.log(`     (no transcripts retrieved for ${dayKey})`);
      daysProcessed++;
      continue;
    }

    // Normalize and write
    const normalized = deduplicateTranscripts(
      rawTranscripts.map(t => mapFirefliesTranscript(t, dayKey)),
    );

    const rawPath = path.join(PATHS.pulse.raw, `${dayKey}-fireflies.json`);
    writeJSON(rawPath, {
      dayKey,
      fetchedAt: new Date().toISOString(),
      source: 'backfill',
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

    totalNormalized += normalized.length;
    daysProcessed++;
  }

  // Sort index entries chronologically and persist
  index.entries.sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  index.lastUpdatedAt = new Date().toISOString();
  writeJSON(PATHS.state.transcriptIndex, index);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`
━━━ Backfill complete ━━━

  Days scanned:      ${dayKeys.length}
  Days with calls:   ${daysProcessed}
  Days skipped:      ${daysSkipped} (already existed)
  Transcript IDs:    ${totalIds}
  Fetched:           ${totalFetched}
  Failed/skipped:    ${totalFailed}
  Normalized total:  ${totalNormalized}

Next step: open Claude Code and run /pulse to synthesize
the transcripts into the Customer Pulse Master doc.
`);
}

run().catch(err => {
  logger.error('Backfill fatal error', err);
  process.exit(1);
});
