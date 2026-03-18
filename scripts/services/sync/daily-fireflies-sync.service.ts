/**
 * Daily Fireflies sync: fetches previous-day transcripts, normalizes, indexes.
 * Non-AI. No Claude calls.
 */
import path from 'path';
import { ENV } from '../../config/env';
import { PATHS } from '../../config/paths';
import { FirefliesClient } from '../../integrations/fireflies/client';
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
    const client = new FirefliesClient(ENV.fireflies.apiKey);
    const fromDate = dayStartUTC(prevDay, tz);
    const toDate   = dayEndUTC(prevDay, tz);

    const rawTranscripts = await client.getTranscripts(fromDate, toDate);
    logger.info('Fireflies raw fetch', { count: rawTranscripts.length });

    const normalized = deduplicateTranscripts(
      rawTranscripts.map(t => mapFirefliesTranscript(t, prevDay)),
    );

    // Write raw payload
    const rawPath = path.join(PATHS.pulse.raw, `${prevDay}-fireflies.json`);
    writeJSON(rawPath, { dayKey: prevDay, fetchedAt: isoNow(), transcripts: rawTranscripts });

    // Write normalized file
    const normalizedFile: NormalizedTranscriptFile = {
      dayKey:       prevDay,
      generatedAt:  isoNow(),
      transcripts:  normalized,
    };

    const normPath = path.join(PATHS.pulse.normalized, `${prevDay}-transcripts.json`);
    writeJSON(normPath, normalizedFile);

    // Validate against schema
    const { valid, errors } = validateAgainstSchema(normalizedFile, PATHS.schemas.transcript);
    if (!valid) logger.warn('Transcript schema validation failed', { errors });

    // Update transcript index
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
