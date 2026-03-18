/**
 * Daily Fireflies sync: reads Fireflies URLs from Slack channels,
 * fetches each transcript by ID, normalizes, and indexes.
 * Non-AI. No Claude calls.
 */
import path from 'path';
import { ENV } from '../../config/env';
import { PATHS } from '../../config/paths';
import { FirefliesClient } from '../../integrations/fireflies/client';
import { SlackClient } from '../../integrations/slack/client';
import { extractFirefliesIds } from '../../integrations/slack/extractor';
import { mapFirefliesTranscript, deduplicateTranscripts } from '../../integrations/fireflies/mapper';
import { readJSON, writeJSON } from '../../utils/file';
import { previousDayKey, dayStartUTC, dayEndUTC, isoNow } from '../../utils/date';
import { logger } from '../../utils/logger';
import { validateAgainstSchema } from '../../utils/validation';
import type { LastSync, TranscriptIndex, TranscriptIndexEntry } from '../../types/daily';
import type { NormalizedTranscriptFile } from '../../types/transcript';

export async function runDailyFirefliesSync(): Promise<void> {
  const tz      = ENV.timezone;
  const prevDay = previousDayKey(tz);
  logger.info('Fireflies sync started', { forDay: prevDay });

  const lastSync = readJSON<LastSync>(PATHS.state.lastSync) ?? {
    morningSync:    { ranAt: null, status: null },
    eveningSync:    { ranAt: null, status: null },
    dailyFirefliesSync:        { ranAt: null, status: null },
    weeklyCustomerPulseDigest: { ranAt: null, status: null },
  };

  try {
    // ── Step 1: Read Slack channels for previous day's Fireflies URLs ─────────
    const slack    = new SlackClient(ENV.slack.botToken);
    const fromDate = dayStartUTC(prevDay, tz);
    const toDate   = dayEndUTC(prevDay, tz);
    const oldest   = fromDate.getTime() / 1000;
    const latest   = toDate.getTime() / 1000;

    const channelIds = [
      ENV.slack.csCallSummaryChannelId,
      ENV.slack.demoSummaryChannelId,
    ].filter(Boolean);

    logger.info('Fetching Slack messages', { channels: channelIds.length, date: prevDay });

    const allMessages = (
      await Promise.all(channelIds.map(id => slack.getChannelMessages(id, oldest, latest)))
    ).flat();

    const firefliesIds = extractFirefliesIds(allMessages);
    logger.info('Fireflies IDs extracted from Slack', { count: firefliesIds.length });

    if (firefliesIds.length === 0) {
      logger.info('No Fireflies URLs found in Slack for this day — nothing to sync');
      lastSync.dailyFirefliesSync = { ranAt: isoNow(), status: 'success', dayKey: prevDay };
      writeJSON(PATHS.state.lastSync, lastSync);
      return;
    }

    // ── Step 2: Fetch each transcript by ID from Fireflies ────────────────────
    const fireflies = new FirefliesClient(ENV.fireflies.apiKey);

    const rawTranscripts = (
      await Promise.all(
        firefliesIds.map(async id => {
          const t = await fireflies.getTranscriptById(id);
          if (!t) logger.warn('Transcript not found or inaccessible', { id });
          return t;
        }),
      )
    ).filter((t): t is NonNullable<typeof t> => t !== null);

    logger.info('Fireflies transcripts fetched', { requested: firefliesIds.length, retrieved: rawTranscripts.length });

    // ── Step 3: Normalize and deduplicate ─────────────────────────────────────
    const normalized = deduplicateTranscripts(
      rawTranscripts.map(t => mapFirefliesTranscript(t, prevDay)),
    );

    // ── Step 4: Write raw payload ─────────────────────────────────────────────
    const rawPath = path.join(PATHS.pulse.raw, `${prevDay}-fireflies.json`);
    writeJSON(rawPath, { dayKey: prevDay, fetchedAt: isoNow(), source: 'slack', transcripts: rawTranscripts });

    // ── Step 5: Write normalized file ─────────────────────────────────────────
    const normalizedFile: NormalizedTranscriptFile = {
      dayKey:      prevDay,
      generatedAt: isoNow(),
      transcripts: normalized,
    };

    const normPath = path.join(PATHS.pulse.normalized, `${prevDay}-transcripts.json`);
    writeJSON(normPath, normalizedFile);

    // Validate against schema
    const { valid, errors } = validateAgainstSchema(normalizedFile, PATHS.schemas.transcript);
    if (!valid) logger.warn('Transcript schema validation failed', { errors });

    // ── Step 6: Update transcript index ───────────────────────────────────────
    const index = readJSON<TranscriptIndex>(PATHS.state.transcriptIndex) ?? { lastUpdatedAt: null, entries: [] };
    const existingIdx = index.entries.findIndex((e: TranscriptIndexEntry) => e.dayKey === prevDay);
    const entry = { dayKey: prevDay, filePath: normPath, transcriptCount: normalized.length, fetchedAt: isoNow() };
    if (existingIdx >= 0) index.entries[existingIdx] = entry;
    else index.entries.push(entry);
    index.lastUpdatedAt = isoNow();
    writeJSON(PATHS.state.transcriptIndex, index);

    lastSync.dailyFirefliesSync = { ranAt: isoNow(), status: 'success', dayKey: prevDay };
    logger.info('Fireflies sync complete', { normalized: normalized.length, dayKey: prevDay });
  } catch (err) {
    lastSync.dailyFirefliesSync = { ranAt: isoNow(), status: 'failed', dayKey: prevDay, error: String(err) };
    logger.error('Fireflies sync failed', err);
  }

  writeJSON(PATHS.state.lastSync, lastSync);
}

if (require.main === module) {
  runDailyFirefliesSync().catch(err => {
    logger.error('Fireflies sync fatal error', err);
    process.exit(1);
  });
}
