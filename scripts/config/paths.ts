import path from 'path';

const ROOT = path.resolve(__dirname, '..', '..');

export const PATHS = {
  root: ROOT,

  // State
  state: {
    dir:             path.join(ROOT, 'state'),
    currentDay:      path.join(ROOT, 'state', 'current_day.json'),
    lastSync:        path.join(ROOT, 'state', 'last_sync.json'),
    transcriptIndex: path.join(ROOT, 'state', 'transcript_index.json'),
  },

  // Daily
  daily: {
    raw:     path.join(ROOT, 'daily', 'raw'),
    digests: path.join(ROOT, 'daily', 'digests'),
  },

  // Pulse
  pulse: {
    raw:        path.join(ROOT, 'pulse', 'raw'),
    normalized: path.join(ROOT, 'pulse', 'normalized'),
    weekly:     path.join(ROOT, 'pulse', 'weekly'),
    master:     path.join(ROOT, 'pulse', 'master', 'customer-pulse-master.md'),
  },

  // Schemas
  schemas: {
    currentDay:   path.join(ROOT, 'schemas', 'current_day.schema.json'),
    pulse:        path.join(ROOT, 'schemas', 'pulse.schema.json'),
    transcript:   path.join(ROOT, 'schemas', 'transcript.schema.json'),
    prdStatus:    path.join(ROOT, 'schemas', 'prd-status.schema.json'),
    syncStatus:   path.join(ROOT, 'schemas', 'sync-status.schema.json'),
    todoistTask:  path.join(ROOT, 'schemas', 'todoist-task.schema.json'),
  },

  // Context
  context: {
    teamList:        path.join(ROOT, 'context', 'system', 'team-list.md'),
    routingScoring:  path.join(ROOT, 'context', 'system', 'routing-and-scoring.md'),
    businessProfile: path.join(ROOT, 'context', 'business', 'business_profile.md'),
    uxPatterns:      path.join(ROOT, 'context', 'product', 'ux_patterns.md'),
    glossary:        path.join(ROOT, 'context', 'product', 'product_glossary.md'),
  },

  // PRDs
  prds: (featureName: string) => path.join(ROOT, 'PRDs', featureName),
} as const;
