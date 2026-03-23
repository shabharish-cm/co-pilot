import { test, expect } from '@playwright/test';

// ── Terminal sidebar (available on BOARD / PULSE / PRD / SETTINGS tabs) ───────
// On HOME tab, CLI is always visible inline — no sidebar toggle needed.

test.describe('Terminal Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // HOME is default — navigate to BOARD where the sidebar toggle is available
    await page.getByRole('button', { name: 'BOARD' }).click();
    await page.waitForSelector('text=BACKLOG', { timeout: 10000 });
  });

  test('TERMINAL button is visible on the right edge when sidebar is closed', async ({ page }) => {
    // Sidebar is closed by default — TERMINAL ◆ rotated button should be visible
    await expect(page.locator('button').filter({ hasText: /TERMINAL/ }).last()).toBeVisible();
  });

  test('clicking TERMINAL button opens the sidebar', async ({ page }) => {
    await page.locator('button').filter({ hasText: /TERMINAL/ }).last().click();
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).toBeVisible();
  });

  test('Cmd+K shortcut opens the terminal sidebar', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(300);
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).toBeVisible();
  });

  test('CLAUDE button in navbar also opens the sidebar', async ({ page }) => {
    const claudeBtn = page.locator('nav button').filter({ hasText: /CLAUDE/ });
    await expect(claudeBtn).toBeVisible();
    await claudeBtn.click();
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).toBeVisible();
  });

  test('terminal shows quick command badges', async ({ page }) => {
    await page.locator('button').filter({ hasText: /TERMINAL/ }).last().click();
    await expect(page.locator('button:has-text("/morning")')).toBeVisible();
    await expect(page.locator('button:has-text("/eod")')).toBeVisible();
    await expect(page.locator('button:has-text("/now")')).toBeVisible();
    await expect(page.locator('button:has-text("/pulse")')).toBeVisible();
  });

  test('terminal shows input with $ prompt and placeholder', async ({ page }) => {
    await page.locator('button').filter({ hasText: /TERMINAL/ }).last().click();
    await expect(page.locator('input[placeholder*="claude"]')).toBeVisible();
  });

  test('plain question gets a response from Claude', async ({ page }) => {
    test.setTimeout(60000);
    await page.locator('button').filter({ hasText: /TERMINAL/ }).last().click();
    const input = page.locator('input[placeholder*="claude"]');
    await input.fill('reply with just the word: pong');
    await input.press('Enter');
    await expect(page.locator('pre').filter({ hasText: /pong/i }).first()).toBeVisible({ timeout: 50000 });
  });

  test('/now slash command returns focused actions', async ({ page }) => {
    test.setTimeout(60000);
    await page.locator('button').filter({ hasText: /TERMINAL/ }).last().click();
    const nowBtn = page.locator('button:has-text("/now")');
    await nowBtn.click();
    // Wait for output to appear — claude can take 20-30s
    await expect(page.locator('pre').filter({ hasText: /Focus|Next|Action/i }).first()).toBeVisible({ timeout: 50000 });
  });

  test('Ctrl+L clears terminal output', async ({ page }) => {
    await page.locator('button').filter({ hasText: /TERMINAL/ }).last().click();
    const input = page.locator('input[placeholder*="claude"]');
    await input.fill('hello');
    await input.press('Enter');
    await page.waitForTimeout(500);
    await input.press('Control+l');
    await expect(page.locator('span').filter({ hasText: '$ hello' })).not.toBeVisible();
  });

  test('↑ arrow recalls command history', async ({ page }) => {
    await page.locator('button').filter({ hasText: /TERMINAL/ }).last().click();
    const input = page.locator('input[placeholder*="claude"]');
    await input.fill('my-test-command-xyz');
    await input.press('Enter');
    await page.waitForTimeout(300);
    await input.press('ArrowUp');
    await expect(input).toHaveValue('my-test-command-xyz');
  });

  test('close button (×) hides the sidebar', async ({ page }) => {
    await page.locator('button').filter({ hasText: /TERMINAL/ }).last().click();
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).toBeVisible();
    await page.click('button:has-text("×")');
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).not.toBeVisible();
  });

  test('CLAUDE button is hidden on HOME tab', async ({ page }) => {
    // Navigate back to HOME — CLAUDE button should not be visible
    await page.getByRole('button', { name: 'HOME' }).click();
    await page.waitForTimeout(300);
    await expect(page.locator('nav button').filter({ hasText: /CLAUDE/ })).not.toBeVisible();
  });
});

// ── Home CLI panel (always-visible inline terminal on HOME tab) ───────────────

test.describe('Home tab — CLI terminal (inline)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('CLI input accepts text on HOME tab', async ({ page }) => {
    const input = page.locator('input[placeholder*="claude"]').first();
    await expect(input).toBeVisible();
    await input.fill('hello');
    await expect(input).toHaveValue('hello');
  });

  test('CLR button is visible in home CLI panel', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'CLR' })).toBeVisible();
  });

  test('quick command buttons are visible in home CLI panel', async ({ page }) => {
    for (const cmd of ['/morning', '/eod', '/now', '/pulse']) {
      await expect(page.getByRole('button', { name: cmd })).toBeVisible();
    }
  });
});

// ── Claude CLI API — direct ──────────────────────────────────────────────────

test.describe('Claude CLI API — direct', () => {
  test('POST /api/shell empty command returns 200', async ({ request }) => {
    const res = await request.post('/api/shell', {
      data: { command: '' },
    });
    expect(res.status()).toBe(200);
  });

  test('POST /api/shell returns a streaming response', async ({ request }) => {
    const res = await request.post('/api/shell', {
      data: { command: 'say hello in one word' },
      timeout: 30000,
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body.length).toBeGreaterThan(0);
  });
});
