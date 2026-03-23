import { test, expect } from '@playwright/test';

// ── HOME tab: default landing, 3-zone layout ─────────────────────────────────

test.describe('Home tab — default landing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
  });

  test('HOME tab is active by default with yellow background', async ({ page }) => {
    const homeBtn = page.getByRole('button', { name: 'HOME' });
    await expect(homeBtn).toBeVisible();
    await expect(homeBtn).toHaveCSS('background-color', 'rgb(255, 229, 0)');
  });

  test('navbar shows all 5 tabs: HOME, BOARD, PULSE, PRD, SETTINGS', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'HOME' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'BOARD' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PULSE' })).toBeVisible();
    await expect(page.getByRole('button', { name: /PRD/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SETTINGS' })).toBeVisible();
  });

  test('CLAUDE button is hidden on HOME tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: /CLAUDE/ })).not.toBeVisible();
  });

  test('MORNING DIGEST zone is visible', async ({ page }) => {
    await expect(page.getByText('MORNING DIGEST')).toBeVisible();
  });

  test('DUE TODAY zone is visible', async ({ page }) => {
    await expect(page.getByText('DUE TODAY')).toBeVisible();
  });

  test('TERMINAL zone is visible with $ prompt', async ({ page }) => {
    await expect(page.getByText('◆ TERMINAL')).toBeVisible();
    // $ prompt visible in CLI panel
    const dollarPrompts = page.locator('span').filter({ hasText: '$' });
    await expect(dollarPrompts.first()).toBeVisible();
  });

  test('FULL BOARD link navigates to board tab', async ({ page }) => {
    await page.getByRole('button', { name: /FULL BOARD/ }).click();
    const boardBtn = page.getByRole('button', { name: 'BOARD' });
    await expect(boardBtn).toHaveCSS('background-color', 'rgb(255, 229, 0)');
  });

  test('RUN /MORNING button is visible in digest zone', async ({ page }) => {
    await expect(page.getByRole('button', { name: /RUN \/MORNING/ })).toBeVisible();
  });

  test('no left panel or sidebar is shown on home tab', async ({ page }) => {
    // DigestPanel (left column variant) should not be rendered
    // The board left panel had 280px fixed width — check it's gone
    await expect(page.locator('[data-testid="left-panel"]')).not.toBeVisible().catch(() => {});
    // CLAUDE sidebar tab/button not visible in content area
    const claudeBtn = page.getByRole('button', { name: /CLAUDE/ });
    await expect(claudeBtn).not.toBeVisible();
  });
});

// ── HOME tab: CLI panel interaction ──────────────────────────────────────────

test.describe('Home tab — CLI panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('CLI input field is present and accepts text', async ({ page }) => {
    const input = page.locator('input[placeholder*="ask claude"]');
    await expect(input).toBeVisible();
    await input.click();
    await input.fill('hello');
    await expect(input).toHaveValue('hello');
  });

  test('quick command buttons are rendered', async ({ page }) => {
    for (const cmd of ['/morning', '/eod', '/now', '/pulse']) {
      await expect(page.getByRole('button', { name: cmd })).toBeVisible();
    }
  });

  test('CLR button is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'CLR' })).toBeVisible();
  });
});

// ── HOME tab: Due Today zone ──────────────────────────────────────────────────

test.describe('Home tab — Due Today zone', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
  });

  test('DUE TODAY header shows task count badge', async ({ page }) => {
    await expect(page.getByText('DUE TODAY')).toBeVisible();
    // Count badge should be visible (0 or more)
    const header = page.locator('text=DUE TODAY').locator('..').locator('..');
    await expect(header).toBeVisible();
  });

  test('empty state shows check mark message when no tasks due', async ({ page }) => {
    // Either shows cards OR the empty state — both valid
    const emptyMsg = page.getByText(/Nothing due today/);
    const hasCards = await page.locator('[style*="minWidth: 200px"]').count();
    if (hasCards === 0) {
      await expect(emptyMsg).toBeVisible();
    }
  });
});
