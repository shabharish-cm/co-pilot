import { test, expect } from '@playwright/test';

// ── Task drawer — open, edit, subtasks, comments ─────────────────────────────

async function openFirstDrawer(page: import('@playwright/test').Page) {
  const openBtn = page.locator('button:has-text("OPEN ↗")').first();
  const count = await openBtn.count();
  if (count === 0) return false;
  await openBtn.click();
  await page.waitForSelector('label:has-text("TITLE")', { timeout: 5000 });
  return true;
}

test.describe('Task Drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // HOME is now default — navigate to BOARD where OPEN ↗ buttons exist on task cards
    await page.getByRole('button', { name: 'BOARD' }).click();
    await page.waitForSelector('text=BACKLOG', { timeout: 10000 });
    await page.waitForTimeout(2000); // allow tasks to load
  });

  test('OPEN button on task card opens drawer', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await expect(page.locator('label:has-text("TITLE")')).toBeVisible();
    await expect(page.locator('label:has-text("STATUS")')).toBeVisible();
  });

  test('drawer has TITLE, SECTION, STATUS, PRIORITY, DUE DATE fields', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await expect(page.locator('label:has-text("TITLE")')).toBeVisible();
    await expect(page.locator('label:has-text("SECTION")')).toBeVisible();
    await expect(page.locator('label:has-text("STATUS")')).toBeVisible();
    await expect(page.locator('label:has-text("PRIORITY")')).toBeVisible();
    await expect(page.locator('label:has-text("DUE DATE")')).toBeVisible();
  });

  test('drawer shows LABELS section', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await expect(page.locator('label:has-text("LABELS")')).toBeVisible();
  });

  test('drawer shows SUBTASKS section', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await expect(page.locator('text=SUBTASKS')).toBeVisible();
  });

  test('add subtask input is visible in drawer', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await expect(page.locator('input[placeholder="Add subtask…"]')).toBeVisible();
  });

  test('subtask rows are clickable when subtasks exist', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    // Subtask rows inside the drawer: divs with border and cursor:pointer
    // Scope to the drawer panel (right-side panel)
    const drawer = page.locator('[style*="position: fixed"][style*="right: 0"]').last();
    const subtaskSection = drawer.locator('text=SUBTASKS').locator('../../..');
    const subtaskRows = subtaskSection.locator('[style*="cursor: pointer"]');
    if (await subtaskRows.count() > 0) {
      await expect(subtaskRows.first()).toHaveCSS('cursor', 'pointer');
    }
  });

  test('drawer shows COMMENTS section', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await expect(page.locator('div').filter({ hasText: /^COMMENTS \(\d+\)$/ }).first()).toBeVisible();
  });

  test('drawer shows POST COMMENT button', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await expect(page.locator('button:has-text("POST COMMENT")')).toBeVisible();
  });

  test('drawer footer has MARK COMPLETE button', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await expect(page.locator('button:has-text("MARK COMPLETE")')).toBeVisible();
  });

  test('Escape key closes drawer', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await page.keyboard.press('Escape');
    await expect(page.locator('label:has-text("TITLE")')).not.toBeVisible();
  });

  test('clicking backdrop closes drawer', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    // Backdrop is the fixed overlay to the left of the drawer
    await page.mouse.click(100, 400);
    await expect(page.locator('label:has-text("TITLE")')).not.toBeVisible();
  });

  test('MARK COMPLETE shows confirmation modal', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    await page.click('button:has-text("MARK COMPLETE")');
    await expect(page.locator('text=Mark complete in Todoist')).toBeVisible();
    await page.click('button:has-text("CANCEL")');
  });

  test('label input appears when add label is clicked', async ({ page }) => {
    const opened = await openFirstDrawer(page);
    if (!opened) test.skip(true, 'No tasks loaded');
    // Scope to the drawer to avoid backdrop interception
    const drawer = page.locator('[style*="position: fixed"][style*="right: 0"]').last();
    // The dashed + ADD button inside LABELS section
    const addLabelBtn = drawer.locator('button').filter({ hasText: '+ ADD' }).first();
    await addLabelBtn.click();
    const labelInput = drawer.locator('input[placeholder="label-name"]');
    await expect(labelInput).toBeVisible();
    await labelInput.fill('test-label-xyz');
    await labelInput.press('Escape');
  });
});
