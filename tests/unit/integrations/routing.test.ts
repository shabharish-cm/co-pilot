/**
 * Tests for task section routing.
 * Covers Scenarios I, J, K from the QA test cases.
 */
import { routeTask } from '../../../scripts/integrations/todoist/routing';

describe('routeTask', () => {
  // Scenario I — CS team member match
  test('routes "share mockup to KN" to CS Requests', () => {
    const result = routeTask('share mockup to KN');
    expect(result.sectionName).toBe('CS Requests');
    expect(result.rule).toBe('cs-member');
    expect(result.confidence).toBe('matched');
    expect(result.match).toMatch(/kn/i);
  });

  test('routes task mentioning Karthik to CS Requests', () => {
    const result = routeTask('Send update to Karthik');
    expect(result.sectionName).toBe('CS Requests');
    expect(result.confidence).toBe('matched');
  });

  test('routes task mentioning Gowtham to CS Requests', () => {
    const result = routeTask('follow up with Gowtham on renewal');
    expect(result.sectionName).toBe('CS Requests');
    expect(result.confidence).toBe('matched');
  });

  // Engg member match
  test('routes task with Dhamo to Engg asks', () => {
    const result = routeTask('review API contract with Dhamo');
    expect(result.sectionName).toBe('Engg asks');
    expect(result.confidence).toBe('matched');
  });

  test('routes task with Saran to Engg asks', () => {
    const result = routeTask('align on schema changes with Saran');
    expect(result.sectionName).toBe('Engg asks');
    expect(result.confidence).toBe('matched');
  });

  // Scenario J — CS + Engg conflict, CS wins
  test('CS beats Engg when both present; competing match logged', () => {
    const result = routeTask('share mockup to KN and Saran');
    expect(result.sectionName).toBe('CS Requests');
    expect(result.competingMatch).toBeDefined();
    expect(result.competingMatch?.rule).toBe('engg-member');
    expect(result.competingMatch?.match).toMatch(/saran/i);
  });

  // Effy keyword — highest priority
  test('effy keyword routes to effy section', () => {
    const result = routeTask('effy onboarding flow');
    expect(result.sectionName).toBe('effy');
    expect(result.rule).toBe('effy-keyword');
    expect(result.confidence).toBe('matched');
  });

  test('effy beats CS member', () => {
    const result = routeTask('effy review with KN');
    expect(result.sectionName).toBe('effy');
  });

  // Feature keywords
  test('feature keyword routes to Features with inferred confidence', () => {
    const result = routeTask('design new onboarding flow');
    expect(result.sectionName).toBe('Features');
    expect(result.confidence).toBe('inferred');
  });

  test('prd keyword routes to Features', () => {
    const result = routeTask('write PRD for reporting module');
    expect(result.sectionName).toBe('Features');
    expect(result.confidence).toBe('inferred');
  });

  // Scenario K — no signal, defaults
  test('no signal defaults to Features with defaulted confidence', () => {
    const result = routeTask('check analytics numbers');
    expect(result.sectionName).toBe('Features');
    expect(result.confidence).toBe('defaulted');
  });

  test('empty string defaults to Features', () => {
    const result = routeTask('');
    expect(result.sectionName).toBe('Features');
    expect(result.confidence).toBe('defaulted');
  });

  // Label fallback
  test('follow-up label routes to CS Requests', () => {
    const result = routeTask('call prep', ['follow-up']);
    expect(result.sectionName).toBe('CS Requests');
    expect(result.confidence).toBe('label-inferred');
  });

  test('engineering label routes to Engg asks', () => {
    const result = routeTask('spike task', ['engineering']);
    expect(result.sectionName).toBe('Engg asks');
    expect(result.confidence).toBe('label-inferred');
  });

  // Case insensitivity
  test('cs member match is case-insensitive', () => {
    expect(routeTask('share mockup to kn').sectionName).toBe('CS Requests');
    expect(routeTask('share mockup to KN').sectionName).toBe('CS Requests');
    expect(routeTask('share mockup to Kn').sectionName).toBe('CS Requests');
  });

  // CM section — org-level tasks
  test('routes "customer pulse initiative" to CM', () => {
    const result = routeTask('customer pulse initiative kickoff');
    expect(result.sectionName).toBe('CM');
    expect(result.rule).toBe('cm-keyword');
    expect(result.confidence).toBe('inferred');
  });

  test('routes "quick wins" task to CM', () => {
    const result = routeTask('gather quick wins from feedback analysis');
    expect(result.sectionName).toBe('CM');
  });

  test('routes "initiative" task to CM', () => {
    const result = routeTask('Q2 feedback initiative planning');
    expect(result.sectionName).toBe('CM');
  });

  test('CM keyword takes priority over feature keywords', () => {
    // "customer pulse initiative" contains no feature keyword but is org-level
    const result = routeTask('customer pulse initiative');
    expect(result.sectionName).toBe('CM');
  });

  test('CM label routes to CM section when no keyword matches', () => {
    const result = routeTask('prep for Thursday meeting', ['cm']);
    expect(result.sectionName).toBe('CM');
    expect(result.confidence).toBe('label-inferred');
  });

  test('CS member still beats CM keyword', () => {
    // Team member signals override org keywords
    const result = routeTask('initiative review with KN');
    expect(result.sectionName).toBe('CS Requests');
  });

  test('CM section ID is correct', () => {
    const result = routeTask('customer pulse initiative');
    expect(result.sectionId).toBe('6g9wjjpVgppgxJwQ');
  });
});
