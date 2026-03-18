export type Placement = 'Quick Win' | 'Strategic Bet' | 'Reconsider' | 'Avoid / Defer';
export type EvidenceBasis = 'transcript-backed' | 'inferred' | 'labeled by requestor';

export interface ValueEffortScore {
  value: 'H' | 'M' | 'L';
  effort: 'H' | 'M' | 'L';
  placement: Placement;
  effortNote: string;   // always "estimated" until validated by engineering
  evidenceBasis: EvidenceBasis;
}

export interface PulseEntry {
  id: string;
  title: string;
  description: string;
  sourceTranscriptIds: string[];
  score?: ValueEffortScore;
  recurringIn?: string[];  // prior weekKeys where this appeared, e.g. ["2026-W11"]
}

export interface PulseWeek {
  weekKey: string;         // e.g. "2026-W12"
  windowStart: string;     // YYYY-MM-DD
  windowEnd: string;       // YYYY-MM-DD
  generatedAt: string;
  featureRequests: PulseEntry[];
  existingProblems: PulseEntry[];
  customersLove: PulseEntry[];
}
