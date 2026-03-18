/**
 * Validates section registry and model routing guardrails (Scenario L).
 */
import { TODOIST_SECTIONS } from '../../../scripts/config/sections';

describe('TODOIST_SECTIONS registry', () => {
  test('all four sections are present', () => {
    expect(TODOIST_SECTIONS.features).toBeDefined();
    expect(TODOIST_SECTIONS.csRequests).toBeDefined();
    expect(TODOIST_SECTIONS.enggAsks).toBeDefined();
    expect(TODOIST_SECTIONS.effy).toBeDefined();
  });

  test('section IDs match known values', () => {
    expect(TODOIST_SECTIONS.features.id).toBe('6g8x4JxwH876pgGQ');
    expect(TODOIST_SECTIONS.csRequests.id).toBe('6g8x4HVHxpWVfVHQ');
    expect(TODOIST_SECTIONS.enggAsks.id).toBe('6g8x4MgXR2q68fgQ');
    expect(TODOIST_SECTIONS.effy.id).toBe('6g9QcvpjJw2cFmCx');
  });

  test('section names match known values', () => {
    expect(TODOIST_SECTIONS.features.name).toBe('Features');
    expect(TODOIST_SECTIONS.csRequests.name).toBe('CS Requests');
    expect(TODOIST_SECTIONS.enggAsks.name).toBe('Engg asks');
    expect(TODOIST_SECTIONS.effy.name).toBe('effy');
  });

  test('all IDs are unique', () => {
    const ids = Object.values(TODOIST_SECTIONS).map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// Scenario L — model routing guardrail (structural check)
describe('command files declare model routing (Scenario L)', () => {
  const fs = require('fs');
  const path = require('path');
  const commandsDir = path.join(__dirname, '..', '..', '..', '.claude', 'commands');

  const HAIKU_COMMANDS  = ['morning.md', 'eod.md', 'prd.md'];
  const SONNET_COMMANDS = ['now.md', 'research.md', 'jtbd.md', 'wireframe.md'];

  for (const file of HAIKU_COMMANDS) {
    test(`${file} declares Haiku as writer`, () => {
      const content = fs.readFileSync(path.join(commandsDir, file), 'utf-8');
      expect(content.toLowerCase()).toContain('haiku');
    });
  }

  for (const file of SONNET_COMMANDS) {
    test(`${file} declares Sonnet`, () => {
      const content = fs.readFileSync(path.join(commandsDir, file), 'utf-8');
      expect(content.toLowerCase()).toContain('sonnet');
    });
  }

  test('pulse.md declares both Sonnet and Haiku', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'pulse.md'), 'utf-8').toLowerCase();
    expect(content).toContain('sonnet');
    expect(content).toContain('haiku');
  });
});
