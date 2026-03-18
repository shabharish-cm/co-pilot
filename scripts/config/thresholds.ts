/** Staleness thresholds in milliseconds. */
export const THRESHOLDS = {
  dailyStateStaleMs:      12 * 60 * 60 * 1000,  // 12 hours
  digestWarningMs:        24 * 60 * 60 * 1000,  // 24 hours
  transcriptStaleMs:      36 * 60 * 60 * 1000,  // 36 hours
  weeklyPulseStaleMs:      8 * 24 * 60 * 60 * 1000, // 8 days
  prdReviewWarningMs:     30 * 24 * 60 * 60 * 1000, // 30 days
} as const;
