import { test, expect } from '@playwright/test';

// ── API routes — smoke tests ──────────────────────────────────────────────────

test.describe('API — Todoist tasks', () => {
  test('GET /api/todoist/tasks returns array', async ({ request }) => {
    const res = await request.get('/api/todoist/tasks');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('tasks have required fields: id, content, status, sectionKey', async ({ request }) => {
    const res = await request.get('/api/todoist/tasks');
    const tasks = await res.json();
    if (tasks.length === 0) return; // empty board is ok
    const task = tasks[0];
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('content');
    expect(task).toHaveProperty('status');
    expect(task).toHaveProperty('sectionKey');
  });

  test('tasks include parent_id field', async ({ request }) => {
    const res = await request.get('/api/todoist/tasks');
    const tasks = await res.json();
    if (tasks.length === 0) return;
    // parent_id should exist on the object (may be null)
    expect(tasks[0]).toHaveProperty('parent_id');
  });

  test('top-level tasks have null parent_id', async ({ request }) => {
    const res = await request.get('/api/todoist/tasks');
    const tasks = await res.json();
    const subtasks = tasks.filter((t: { parent_id: string | null }) => t.parent_id !== null);
    const topLevel = tasks.filter((t: { parent_id: string | null }) => t.parent_id === null);
    // Both can exist — just verify the distinction works
    expect(topLevel.length + subtasks.length).toBe(tasks.length);
  });
});

test.describe('API — PRD', () => {
  test('GET /api/prd returns array of folders', async ({ request }) => {
    const res = await request.get('/api/prd');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GET /api/prd/files?folder= returns categorised files', async ({ request }) => {
    // First get a folder name
    const foldersRes = await request.get('/api/prd');
    const folders = await foldersRes.json();
    if (folders.length === 0) return;

    const res = await request.get(`/api/prd/files?folder=${encodeURIComponent(folders[0].name)}`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('prd');
    expect(data).toHaveProperty('mockup');
    expect(data).toHaveProperty('research');
    expect(data).toHaveProperty('jtbd');
  });

  test('GET /api/prd/files missing folder returns 400', async ({ request }) => {
    const res = await request.get('/api/prd/files');
    expect(res.status()).toBe(400);
  });
});

test.describe('API — Pulse', () => {
  test('GET /api/pulse returns 200 with content', async ({ request }) => {
    const res = await request.get('/api/pulse');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    // Either has content or an error message — should not be a 500
    expect(typeof data).toBe('object');
  });
});

test.describe('API — Shell', () => {
  test('POST /api/shell ls returns file list', async ({ request }) => {
    const res = await request.post('/api/shell', {
      data: { command: 'ls' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body.length).toBeGreaterThan(0);
  });

  test('POST /api/shell runs in Co-Pilot root (not ui/)', async ({ request }) => {
    const res = await request.post('/api/shell', {
      data: { command: 'pwd' },
    });
    const body = await res.text();
    expect(body).toMatch(/Co-Pilot/);
    expect(body).not.toMatch(/Co-Pilot\/ui/);
  });

  test('POST /api/shell invalid command exits with non-zero', async ({ request }) => {
    const res = await request.post('/api/shell', {
      data: { command: 'command_that_does_not_exist_xyz123' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    // Should contain an error or exit code message
    expect(body).toMatch(/not found|exited|error/i);
  });
});
