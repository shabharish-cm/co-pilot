import { test, expect } from '@playwright/test';

// ── Board tab: Kanban columns, filtering, task cards ─────────────────────────

test.describe('Board — layout and columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=BOARD', { timeout: 10000 });
  });

  test('renders the main navbar with all four tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'BOARD' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PULSE' })).toBeVisible();
    await expect(page.getByRole('button', { name: /PRD/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SETTINGS' })).toBeVisible();
  });

  test('BOARD tab is active by default with yellow background', async ({ page }) => {
    const boardBtn = page.getByRole('button', { name: 'BOARD' });
    // Yellow = rgb(255, 229, 0)
    await expect(boardBtn).toHaveCSS('background-color', 'rgb(255, 229, 0)');
  });

  test('shows kanban columns: BACKLOG and IN PROGRESS', async ({ page }) => {
    await expect(page.getByText('BACKLOG', { exact: true })).toBeVisible();
    await expect(page.getByText('IN PROGRESS', { exact: true })).toBeVisible();
  });

  test('DONE column is always visible', async ({ page }) => {
    await expect(page.getByText('DONE', { exact: true })).toBeVisible();
  });

  test('column headers show task count badges', async ({ page }) => {
    await page.waitForTimeout(2000);
    // Count badges are spans with digit content inside column headers
    const badges = page.locator('span').filter({ hasText: /^\d+$/ });
    await expect(badges.first()).toBeVisible();
  });

  test('toolbar shows + ADD TASK button', async ({ page }) => {
    await expect(page.getByRole('button', { name: '+ ADD TASK' })).toBeVisible();
  });

  test('toolbar shows FILTER button', async ({ page }) => {
    await expect(page.locator('button').filter({ hasText: /^FILTER/ })).toBeVisible();
  });

  test('sync status shows in toolbar', async ({ page }) => {
    await page.waitForTimeout(3000);
    const sync = page.locator('span').filter({ hasText: /ago|syncing|next/ });
    await expect(sync.first()).toBeVisible();
  });
});

test.describe('Board — filter dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('button', { timeout: 10000 });
    await page.locator('button').filter({ hasText: /^FILTER/ }).click();
    await page.waitForSelector('text=CLEAR FILTERS', { timeout: 5000 });
  });

  test('filter dropdown opens with SECTION and DUE labels', async ({ page }) => {
    await expect(page.getByText('SECTION', { exact: true })).toBeVisible();
    await expect(page.getByText('DUE', { exact: true })).toBeVisible();
  });

  test('due filter has exactly 3 checkboxes', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(3);
  });

  test('can select multiple due filters simultaneously', async ({ page }) => {
    await page.getByLabel('Overdue').check();
    await page.getByLabel('Due today').check();
    const checked = page.locator('input[type="checkbox"]:checked');
    await expect(checked).toHaveCount(2);
  });

  test('FILTER button shows ● indicator when filter applied', async ({ page }) => {
    await page.getByLabel('Overdue').check();
    // Close dropdown and check button text
    await page.keyboard.press('Escape');
    await page.mouse.click(10, 10);
    const filterBtn = page.locator('button').filter({ hasText: /^FILTER/ });
    await expect(filterBtn).toContainText('●');
  });

  test('CLEAR FILTERS resets all checkboxes', async ({ page }) => {
    await page.getByLabel('Overdue').check();
    await page.getByLabel('Due today').check();
    await page.getByRole('button', { name: 'CLEAR FILTERS' }).click();
    const checked = page.locator('input[type="checkbox"]:checked');
    await expect(checked).toHaveCount(0);
  });

  test('section radio buttons exist', async ({ page }) => {
    const radios = page.locator('input[type="radio"]');
    const count = await radios.count();
    expect(count).toBeGreaterThan(0);
  });

  test('filter closes on outside click', async ({ page }) => {
    // Click far from the dropdown (top-right area, away from filter button and dropdown)
    await page.mouse.click(900, 30);
    await page.waitForTimeout(300);
    await expect(page.locator('button:has-text("CLEAR FILTERS")')).not.toBeVisible();
  });
});

test.describe('Board — quick add task', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('button:has-text("+ ADD TASK")', { timeout: 10000 });
  });

  test('clicking + ADD TASK opens quick add form', async ({ page }) => {
    await page.getByRole('button', { name: '+ ADD TASK' }).click();
    // Quick add form should appear
    await expect(page.locator('textarea, input').filter({ hasText: '' }).first()).toBeVisible();
  });

  test('Cmd+N keyboard shortcut opens quick add form', async ({ page }) => {
    await page.keyboard.press('Meta+n');
    await page.waitForTimeout(500);
    // Some modal or form should appear
    const modals = page.locator('[style*="position: fixed"]');
    await expect(modals.last()).toBeVisible();
  });
});
