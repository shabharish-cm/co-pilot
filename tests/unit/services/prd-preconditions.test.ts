/**
 * PRD and wireframe precondition tests.
 * Covers Scenario G (/wireframe before PRD) and /prd prerequisite checks.
 */
import os from 'os';
import path from 'path';
import fs from 'fs';
import { writeMarkdown, fileExists } from '../../../scripts/utils/file';

const tmpDir = path.join(os.tmpdir(), 'pm-copilot-prd-tests');

beforeAll(() => fs.mkdirSync(tmpDir, { recursive: true }));
afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

/** Simulates the fail-closed check that /prd and /wireframe commands perform. */
function checkPRDPrerequisites(featureDir: string): { ok: boolean; missing: string[] } {
  const required = ['discovery.md', 'jtbd.md', 'research.md'];
  const missing = required.filter(f => !fileExists(path.join(featureDir, f)));
  return { ok: missing.length === 0, missing };
}

function checkWireframePrerequisites(featureDir: string): { ok: boolean; missing: string[] } {
  const required = ['prd.md'];
  const missing = required.filter(f => !fileExists(path.join(featureDir, f)));
  return { ok: missing.length === 0, missing };
}

describe('PRD prerequisite checks', () => {
  test('fails when all files missing', () => {
    const dir = path.join(tmpDir, 'empty-feature');
    fs.mkdirSync(dir, { recursive: true });
    const result = checkPRDPrerequisites(dir);
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('jtbd.md');
    expect(result.missing).toContain('research.md');
  });

  test('fails when only jtbd.md is missing', () => {
    const dir = path.join(tmpDir, 'partial-feature');
    fs.mkdirSync(dir, { recursive: true });
    writeMarkdown(path.join(dir, 'discovery.md'), '# Discovery');
    writeMarkdown(path.join(dir, 'research.md'),  '# Research');
    const result = checkPRDPrerequisites(dir);
    expect(result.ok).toBe(false);
    expect(result.missing).toEqual(['jtbd.md']);
  });

  test('passes when all files present', () => {
    const dir = path.join(tmpDir, 'complete-feature');
    fs.mkdirSync(dir, { recursive: true });
    writeMarkdown(path.join(dir, 'discovery.md'), '# Discovery');
    writeMarkdown(path.join(dir, 'research.md'),  '# Research');
    writeMarkdown(path.join(dir, 'jtbd.md'),       '# JTBD');
    const result = checkPRDPrerequisites(dir);
    expect(result.ok).toBe(true);
    expect(result.missing).toHaveLength(0);
  });
});

// Scenario G — /wireframe before PRD exists
describe('/wireframe prerequisite checks (Scenario G)', () => {
  test('fails when prd.md is missing', () => {
    const dir = path.join(tmpDir, 'no-prd-feature');
    fs.mkdirSync(dir, { recursive: true });
    const result = checkWireframePrerequisites(dir);
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('prd.md');
  });

  test('passes when prd.md exists', () => {
    const dir = path.join(tmpDir, 'has-prd-feature');
    fs.mkdirSync(dir, { recursive: true });
    writeMarkdown(path.join(dir, 'prd.md'), '# PRD content');
    const result = checkWireframePrerequisites(dir);
    expect(result.ok).toBe(true);
  });
});
