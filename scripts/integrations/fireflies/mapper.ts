import { format } from 'date-fns';
import { NormalizedTranscript } from '../../types/transcript';
import { isoNow } from '../../utils/date';
import type { FirefliesTranscript } from './types';

export function mapFirefliesTranscript(raw: FirefliesTranscript, sourceDay: string): NormalizedTranscript {
  const meetingDate = new Date(raw.date).toISOString();
  const summary = [
    raw.summary?.overview,
    raw.summary?.notes,
    raw.summary?.action_items,
  ].filter(Boolean).join('\n\n') || '';

  return {
    transcriptId:   raw.id,
    meetingTitle:   raw.title ?? '(untitled)',
    meetingDate,
    participants:   raw.participants ?? [],
    summary,
    transcriptText: raw.transcript ?? '',
    sourceUrl:      raw.meeting_link ?? '',
    fetchedAt:      isoNow(),
    sourceDay,
  };
}

export function deduplicateTranscripts(transcripts: NormalizedTranscript[]): NormalizedTranscript[] {
  const seen = new Set<string>();
  return transcripts.filter(t => {
    if (seen.has(t.transcriptId)) return false;
    seen.add(t.transcriptId);
    return true;
  });
}
