import { test, expect } from '@playwright/test';

// ── Calendar API — smoke tests ───────────────────────────────────────────────
// Note: The CalendarWidget component is no longer rendered in the main layout.
// The new HOME tab uses DigestZone + DueTodayRow + CliPanel.
// These tests cover the /api/calendar endpoint only.

test.describe('API — Calendar', () => {
  test('GET /api/calendar returns 200 or 503 (not 500)', async ({ request }) => {
    const res = await request.get('/api/calendar');
    expect([200, 503]).toContain(res.status());
  });

  test('GET /api/calendar returns array of day groups or error object', async ({ request }) => {
    const res = await request.get('/api/calendar');
    if (res.ok()) {
      const data = await res.json();
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

// ── Layout verification: calendar widget removed from new UI ─────────────────
// HOME tab now shows: DigestZone (morning digest) | DueTodayRow | CliPanel
// Board tab shows: pure kanban only (no left panel)

test.describe('Layout verification — calendar widget removed', () => {
  test('NEXT 5 DAYS calendar is not visible on HOME tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page.locator('text=NEXT 5 DAYS')).not.toBeVisible();
  });

  test('NEXT 5 DAYS calendar is not visible on BOARD tab', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'BOARD' }).click();
    await page.waitForSelector('text=BACKLOG', { timeout: 10000 });
    await expect(page.locator('text=NEXT 5 DAYS')).not.toBeVisible();
  });
});
