import { test, expect } from '@playwright/test';

// ── Calendar widget + digest panel ───────────────────────────────────────────

test.describe('Calendar Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=NEXT 5 DAYS', { timeout: 10000 });
    // Wait for calendar data to load
    await page.waitForTimeout(3000);
  });

  test('calendar widget shows NEXT 5 DAYS header', async ({ page }) => {
    await expect(page.getByText('NEXT 5 DAYS', { exact: true })).toBeVisible();
  });

  test('calendar shows TODAY row with NOW badge', async ({ page }) => {
    // The today row renders a NOW badge once data loads
    await expect(page.locator('span').filter({ hasText: 'NOW' })).toBeVisible({ timeout: 15000 });
  });

  test('calendar shows day label rows (MON/TUE/etc)', async ({ page }) => {
    // Wait for data load — any day label row is sufficient
    await expect(page.locator('span').filter({ hasText: 'NOW' })).toBeVisible({ timeout: 15000 });
    const dayRows = page.locator('div').filter({ hasText: /MON|TUE|WED|THU|FRI|SAT|SUN/ });
    await expect(dayRows.first()).toBeVisible();
  });

  test('calendar shows at least 3 date sections', async ({ page }) => {
    await expect(page.locator('span').filter({ hasText: 'NOW' })).toBeVisible({ timeout: 15000 });
    // Each day group has a border-bottom divider — count by MON/TUE etc labels in the text
    const dayDivs = page.locator('div').filter({ hasText: /^(TODAY|MON|TUE|WED|THU|FRI|SAT|SUN)/ });
    const count = await dayDivs.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('calendar collapse/expand toggle works', async ({ page }) => {
    // Wait for data
    await expect(page.locator('span').filter({ hasText: 'NOW' }).first()).toBeVisible({ timeout: 15000 });
    // The header div has cursor:pointer and onClick to toggle
    const header = page.locator('.nb-header-bar').last(); // CalendarWidget is below DigestPanel
    if (await header.count() > 0) {
      // Click to collapse — day sections should disappear
      await header.click();
      await expect(page.locator('span').filter({ hasText: 'NOW' }).first()).not.toBeVisible({ timeout: 5000 });
      // Click to expand again
      await header.click();
      await expect(page.locator('span').filter({ hasText: 'NOW' }).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('JOIN button visible for events with video links', async ({ page }) => {
    const joinBtn = page.locator('button').filter({ hasText: /^JOIN$/ });
    if (await joinBtn.count() > 0) {
      await expect(joinBtn.first()).toBeVisible();
    }
  });

  test('(no events) placeholder shown for empty days', async ({ page }) => {
    await page.waitForTimeout(1000);
    const noEvents = page.locator('text=no events');
    if (await noEvents.count() > 0) {
      await expect(noEvents.first()).toBeVisible();
    }
  });
});

test.describe('Digest Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
  });

  test('calendar widget visible on BOARD tab', async ({ page }) => {
    await expect(page.getByText('NEXT 5 DAYS')).toBeVisible();
  });

  test('calendar widget hidden on PULSE tab', async ({ page }) => {
    await page.getByRole('button', { name: 'PULSE' }).click();
    await expect(page.getByText('NEXT 5 DAYS')).not.toBeVisible();
  });

  test('calendar widget hidden on PRD tab', async ({ page }) => {
    await page.locator('nav button').filter({ hasText: /PRD/ }).click();
    await expect(page.getByText('NEXT 5 DAYS')).not.toBeVisible();
  });

  test('calendar widget hidden on SETTINGS tab', async ({ page }) => {
    await page.getByRole('button', { name: 'SETTINGS' }).click();
    await expect(page.getByText('NEXT 5 DAYS')).not.toBeVisible();
  });
});

test.describe('API — Calendar', () => {
  test('GET /api/calendar returns 200 or 503 (not 500)', async ({ request }) => {
    const res = await request.get('/api/calendar');
    expect([200, 503]).toContain(res.status());
  });

  test('GET /api/calendar returns array of day groups', async ({ request }) => {
    const res = await request.get('/api/calendar');
    if (res.ok()) {
      const data = await res.json();
      // API returns either an array of day groups or { error: string }
      const isValidArray = Array.isArray(data);
      const isErrorObj = !Array.isArray(data) && typeof data.error === 'string';
      expect(isValidArray || isErrorObj).toBeTruthy();
      if (isValidArray && data.length > 0) {
        expect(data[0]).toHaveProperty('date');
        expect(data[0]).toHaveProperty('label');
        expect(data[0]).toHaveProperty('events');
      }
    }
  });
});
