export interface NormalizedTranscript {
  transcriptId: string;
  meetingTitle: string;
  meetingDate: string;     // ISO datetime
  participants: string[];
  summary: string;
  transcriptText: string;
  sourceUrl: string;
  fetchedAt: string;       // ISO datetime
  sourceDay: string;       // YYYY-MM-DD
}

export interface NormalizedTranscriptFile {
  dayKey: string;          // YYYY-MM-DD
  generatedAt: string;     // ISO datetime
  transcripts: NormalizedTranscript[];
}

export interface TranscriptIndexEntry {
  dayKey: string;
  filePath: string;
  transcriptCount: number;
  fetchedAt: string;
}

export interface TranscriptIndex {
  lastUpdatedAt: string;
  entries: TranscriptIndexEntry[];
}
