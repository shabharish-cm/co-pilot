// Replicated from scripts/integrations/todoist/routing.ts
// (cannot import from scripts/ in Next.js)

import type { RoutingConfidence, RoutingResult } from './types';

const TODOIST_SECTIONS = {
  features:   { id: '6g8x4JxwH876pgGQ', name: 'Features' },
  csRequests: { id: '6g8x4HVHxpWVfVHQ', name: 'CS Requests' },
  enggAsks:   { id: '6g8x4MgXR2q68fgQ', name: 'Engg asks' },
  effy:       { id: '6g9QcvpjJw2cFmCx', name: 'effy' },
  cm:         { id: '6g9wjjpVgppgxJwQ', name: 'CM' },
} as const;

const FEATURE_KEYWORDS = [
  'build', 'design', 'feature', 'mockup', 'flow', 'prd', 'spec',
  'roadmap', 'wireframe', 'prototype', 'ux', 'ui',
];

const CM_KEYWORDS = [
  'initiative', 'pulse initiative', 'quick wins', 'org', 'platform strategy',
  'customer pulse', 'feedback analysis', 'product strategy',
  'backfill', 'transcript', 'fireflies', 'copilot', 'morning sync',
  'evening sync', 'digest', 'slack export', 'daily sync',
  'blog', 'blog post', 'landing page', 'content strategy', 'marketing content',
  'aeo', 'geo', 'seo content', 'align with marketing', 'brief marketing',
];

// Inline team lists from CLAUDE.md
const CS_ALIASES = ['kn', 'karthik rao', 'karthik', 'gowtham', 'gk', 'yugi'];
const ENGG_ALIASES = ['dhamo', 'dhamodharan', 'sam', 'saran', 'nandha', 'krishna'];

function matchTeamMember(text: string, aliases: string[]): string | undefined {
  const lower = text.toLowerCase();
  return aliases.find(alias => {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`).test(lower);
  });
}

export function routeTask(title: string, labels: string[] = []): RoutingResult {
  const lowerTitle = title.toLowerCase();

  // Priority 1 — effy keyword
  if (lowerTitle.includes('effy')) {
    return {
      sectionId:   TODOIST_SECTIONS.effy.id,
      sectionName: TODOIST_SECTIONS.effy.name,
      rule:        'effy-keyword',
      confidence:  'matched',
      match:       'effy',
    };
  }

  // Priority 2 — CS team member
  const csMatch   = matchTeamMember(title, CS_ALIASES);
  // Priority 3 — Engg team member
  const enggMatch = matchTeamMember(title, ENGG_ALIASES);

  if (csMatch) {
    const result: RoutingResult = {
      sectionId:   TODOIST_SECTIONS.csRequests.id,
      sectionName: TODOIST_SECTIONS.csRequests.name,
      rule:        'cs-member',
      confidence:  'matched',
      match:       csMatch,
    };
    if (enggMatch) result.competingMatch = { rule: 'engg-member', match: enggMatch };
    return result;
  }

  if (enggMatch) {
    return {
      sectionId:   TODOIST_SECTIONS.enggAsks.id,
      sectionName: TODOIST_SECTIONS.enggAsks.name,
      rule:        'engg-member',
      confidence:  'matched',
      match:       enggMatch,
    };
  }

  // Priority 4 — CM org keywords
  const cmHit = CM_KEYWORDS.find(kw => lowerTitle.includes(kw));
  if (cmHit) {
    return {
      sectionId:   TODOIST_SECTIONS.cm.id,
      sectionName: TODOIST_SECTIONS.cm.name,
      rule:        'cm-keyword',
      confidence:  'inferred',
      match:       cmHit,
    };
  }

  // Priority 5 — feature keywords
  const featureHit = FEATURE_KEYWORDS.find(kw => lowerTitle.includes(kw));
  if (featureHit) {
    return {
      sectionId:   TODOIST_SECTIONS.features.id,
      sectionName: TODOIST_SECTIONS.features.name,
      rule:        'feature-keyword',
      confidence:  'inferred',
      match:       featureHit,
    };
  }

  // Priority 6 — label fallback
  const lowerLabels = labels.map(l => l.toLowerCase());
  if (lowerLabels.includes('follow-up')) {
    return { sectionId: TODOIST_SECTIONS.csRequests.id, sectionName: TODOIST_SECTIONS.csRequests.name, rule: 'label-follow-up', confidence: 'label-inferred' };
  }
  if (lowerLabels.includes('engineering')) {
    return { sectionId: TODOIST_SECTIONS.enggAsks.id, sectionName: TODOIST_SECTIONS.enggAsks.name, rule: 'label-engineering', confidence: 'label-inferred' };
  }
  if (lowerLabels.includes('cm')) {
    return { sectionId: TODOIST_SECTIONS.cm.id, sectionName: TODOIST_SECTIONS.cm.name, rule: 'label-cm', confidence: 'label-inferred' };
  }

  // Priority 7 — default
  return {
    sectionId:   TODOIST_SECTIONS.features.id,
    sectionName: TODOIST_SECTIONS.features.name,
    rule:        'default',
    confidence:  'defaulted',
  };
}

export { TODOIST_SECTIONS };
export type { RoutingConfidence, RoutingResult };
