import { test, expect } from '@playwright/test';

// ── Terminal sidebar ──────────────────────────────────────────────────────────

test.describe('Terminal Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=BOARD', { timeout: 10000 });
  });

  test('TERMINAL button is visible on the right edge when closed', async ({ page }) => {
    await expect(page.locator('button:has-text("TERMINAL")')).toBeVisible();
  });

  test('clicking TERMINAL button opens the sidebar', async ({ page }) => {
    await page.click('button:has-text("TERMINAL")');
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).toBeVisible();
  });

  test('Cmd+K shortcut opens the terminal', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).toBeVisible();
  });

  test('terminal shows quick command badges', async ({ page }) => {
    await page.click('button:has-text("TERMINAL")');
    await expect(page.locator('button:has-text("/morning")')).toBeVisible();
    await expect(page.locator('button:has-text("/eod")')).toBeVisible();
    await expect(page.locator('button:has-text("/now")')).toBeVisible();
    await expect(page.locator('button:has-text("/pulse")')).toBeVisible();
  });

  test('terminal shows input with $ prompt', async ({ page }) => {
    await page.click('button:has-text("TERMINAL")');
    await expect(page.locator('input[placeholder*="command"]')).toBeVisible();
  });

  test('plain question gets a response from Claude', async ({ page }) => {
    test.setTimeout(60000);
    await page.click('button:has-text("TERMINAL")');
    const input = page.locator('input[placeholder*="claude"]');
    await input.fill('reply with just the word: pong');
    await input.press('Enter');
    await expect(page.locator('pre').filter({ hasText: /pong/i }).first()).toBeVisible({ timeout: 50000 });
  });

  test('/now slash command returns focused actions', async ({ page }) => {
    test.setTimeout(60000);
    await page.click('button:has-text("TERMINAL")');
    const nowBtn = page.locator('button:has-text("/now")');
    await nowBtn.click();
    // Wait for output to appear — claude can take 20-30s
    await expect(page.locator('pre').filter({ hasText: /Focus|Next|Action/i }).first()).toBeVisible({ timeout: 50000 });
  });

  test('Ctrl+L clears terminal output', async ({ page }) => {
    await page.click('button:has-text("TERMINAL")');
    const input = page.locator('input[placeholder*="claude"]');
    // Type a command but don't wait for Claude response — just check the command line appears
    await input.fill('hello');
    await input.press('Enter');
    await page.waitForTimeout(500);
    // Clear immediately
    await input.press('Control+l');
    await expect(page.locator('span').filter({ hasText: '$ hello' })).not.toBeVisible();
  });

  test('↑ arrow recalls command history', async ({ page }) => {
    await page.click('button:has-text("TERMINAL")');
    const input = page.locator('input[placeholder*="claude"]');
    await input.fill('my-test-command-xyz');
    await input.press('Enter');
    await page.waitForTimeout(300);
    await input.press('ArrowUp');
    await expect(input).toHaveValue('my-test-command-xyz');
  });

  test('close button (×) hides the sidebar', async ({ page }) => {
    await page.click('button:has-text("TERMINAL")');
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).toBeVisible();
    await page.click('button:has-text("×")');
    await expect(page.locator('text=◆ TERMINAL — Co-Pilot')).not.toBeVisible();
  });
});

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
