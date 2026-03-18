import fs from 'fs';
import { PATHS } from '../../config/paths';
import { TODOIST_SECTIONS } from '../../config/sections';
import { logger } from '../../utils/logger';

export type RoutingConfidence = 'matched' | 'inferred' | 'label-inferred' | 'defaulted';

export interface RoutingResult {
  sectionId:   string;
  sectionName: string;
  rule:        string;
  confidence:  RoutingConfidence;
  match?:      string;
  competingMatch?: { rule: string; match: string };
}

interface TeamList {
  cs:   string[];
  engg: string[];
}

const FEATURE_KEYWORDS = [
  'build', 'design', 'feature', 'mockup', 'flow', 'prd', 'spec',
  'roadmap', 'wireframe', 'prototype', 'ux', 'ui',
];

/** Parse context/system/team-list.md into CS and Engg alias arrays. */
function loadTeamList(): TeamList {
  try {
    const raw = fs.readFileSync(PATHS.context.teamList, 'utf-8');
    const cs:   string[] = [];
    const engg: string[] = [];

    let section: 'cs' | 'engg' | null = null;

    for (const line of raw.split('\n')) {
      if (/##\s+Customer Success/i.test(line)) { section = 'cs';   continue; }
      if (/##\s+Eng/i.test(line))              { section = 'engg'; continue; }
      if (/^##/.test(line))                    { section = null;   continue; }

      // Parse table rows: | Name | Aliases |
      const tableRow = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
      if (tableRow && section && tableRow[1] !== 'Name') {
        const aliases = tableRow[2].split(',').map(a => a.trim().toLowerCase()).filter(Boolean);
        const nameAlias = tableRow[1].trim().toLowerCase();
        const all = [...new Set([nameAlias, ...aliases])].filter(a => a !== 'aliases / short forms');
        if (section === 'cs')   cs.push(...all);
        if (section === 'engg') engg.push(...all);
      }
    }

    return { cs, engg };
  } catch {
    logger.warn('Could not load team-list.md — routing will use keyword fallback only');
    return { cs: [], engg: [] };
  }
}

function matchTeamMember(text: string, aliases: string[]): string | undefined {
  const lower = text.toLowerCase();
  return aliases.find(alias => {
    // Match whole words / tokens
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`).test(lower);
  });
}

export function routeTask(title: string, labels: string[] = []): RoutingResult {
  const teams = loadTeamList();
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
  const csMatch   = matchTeamMember(title, teams.cs);
  // Priority 3 — Engg team member
  const enggMatch = matchTeamMember(title, teams.engg);

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

  // Priority 4 — feature keywords
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

  // Priority 5 — label fallback
  const lowerLabels = labels.map(l => l.toLowerCase());
  if (lowerLabels.includes('follow-up')) {
    return { sectionId: TODOIST_SECTIONS.csRequests.id, sectionName: TODOIST_SECTIONS.csRequests.name, rule: 'label-follow-up', confidence: 'label-inferred' };
  }
  if (lowerLabels.includes('engineering')) {
    return { sectionId: TODOIST_SECTIONS.enggAsks.id, sectionName: TODOIST_SECTIONS.enggAsks.name, rule: 'label-engineering', confidence: 'label-inferred' };
  }

  // Priority 6 — default
  return {
    sectionId:   TODOIST_SECTIONS.features.id,
    sectionName: TODOIST_SECTIONS.features.name,
    rule:        'default',
    confidence:  'defaulted',
  };
}
