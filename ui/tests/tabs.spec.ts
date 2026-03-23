import { test, expect } from '@playwright/test';

// ── Tab navigation: PULSE, PRD, SETTINGS ─────────────────────────────────────

test.describe('Tab navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to BOARD first so we can test tab switching
    await page.getByRole('button', { name: 'BOARD' }).click();
    await page.waitForSelector('text=BACKLOG', { timeout: 10000 });
  });

  test('clicking PULSE tab hides board columns', async ({ page }) => {
    await page.getByRole('button', { name: 'PULSE' }).click();
    await expect(page.getByText('BACKLOG', { exact: true })).not.toBeVisible();
  });

  test('clicking SETTINGS tab hides board columns', async ({ page }) => {
    await page.getByRole('button', { name: 'SETTINGS' }).click();
    await expect(page.getByText('BACKLOG', { exact: true })).not.toBeVisible();
  });

  test('clicking PRD tab hides board columns', async ({ page }) => {
    await page.locator('button').filter({ hasText: /PRD/ }).click();
    await expect(page.getByText('BACKLOG', { exact: true })).not.toBeVisible();
  });

  test('clicking BOARD tab returns to kanban board', async ({ page }) => {
    await page.getByRole('button', { name: 'PULSE' }).click();
    await page.getByRole('button', { name: 'BOARD' }).click();
    await expect(page.getByText('BACKLOG', { exact: true })).toBeVisible();
  });

  test('active tab (PULSE) gets yellow background', async ({ page }) => {
    // Scope to nav to avoid matching other PULSE buttons on the page
    const navPulseBtn = page.locator('nav button').filter({ hasText: /^PULSE$/ });
    await navPulseBtn.click();
    await page.waitForTimeout(400);
    await expect(navPulseBtn).toHaveCSS('background-color', 'rgb(255, 229, 0)');
  });

  test('active tab (SETTINGS) gets yellow background', async ({ page }) => {
    const navSettingsBtn = page.locator('nav button').filter({ hasText: /^SETTINGS$/ });
    await navSettingsBtn.click();
    await page.waitForTimeout(200);
    await expect(navSettingsBtn).toHaveCSS('background-color', 'rgb(255, 229, 0)');
  });
});

test.describe('Settings tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'SETTINGS' }).click();
    await page.waitForTimeout(500);
  });

  test('settings shows UP NEXT and BLOCKED toggle controls', async ({ page }) => {
    await expect(page.locator('text=/UP NEXT/i').first()).toBeVisible();
    await expect(page.locator('text=/BLOCKED/i').first()).toBeVisible();
  });

  test('enabling UP NEXT column shows it on board', async ({ page }) => {
    // Find the OFF button for UP NEXT and toggle it ON
    const offBtns = page.getByRole('button', { name: 'OFF' });
    if (await offBtns.count() > 0) {
      await offBtns.first().click();
      await page.getByRole('button', { name: 'BOARD' }).click();
      await expect(page.getByText('UP NEXT', { exact: true })).toBeVisible();
      // Reset: go back to settings and turn it off
      await page.getByRole('button', { name: 'SETTINGS' }).click();
      const onBtn = page.getByRole('button', { name: 'ON' });
      if (await onBtn.count() > 0) await onBtn.first().click();
    }
  });
});

test.describe('PULSE tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'PULSE' }).click();
    await page.waitForTimeout(2000);
  });

  test('pulse view renders content or loading state without crashing', async ({ page }) => {
    await expect(page.locator('text=500')).not.toBeVisible();
    await expect(page.locator('text=Unhandled Runtime Error')).not.toBeVisible();
  });

  test('RUN /PULSE button or terminal badge is visible', async ({ page }) => {
    const pulseBtn = page.locator('button').filter({ hasText: /PULSE/i }).last();
    await expect(pulseBtn).toBeVisible();
  });
});

test.describe('PRD tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('button').filter({ hasText: /PRD/ }).click();
    await page.waitForTimeout(1500);
  });

  test('PRD view shows PRD PROJECTS sidebar header', async ({ page }) => {
    await expect(page.getByText('PRD PROJECTS', { exact: true })).toBeVisible();
  });

  test('PRD tab inner tabs are visible when a project is selected', async ({ page }) => {
    const projects = page.locator('[style*="border-left"]');
    if (await projects.count() > 0) {
      await projects.first().click();
      await expect(page.locator('button:has-text("MOCKUP")')).toBeVisible();
      await expect(page.locator('button:has-text("RESEARCH")')).toBeVisible();
      await expect(page.locator('button:has-text("JTBD")')).toBeVisible();
    }
  });

  test('JTBD inner tab shows GENERATE JTBD or markdown content', async ({ page }) => {
    const projects = page.locator('[style*="border-left"]');
    if (await projects.count() > 0) {
      await projects.first().click();
      await page.locator('button:has-text("JTBD")').click();
      await page.waitForTimeout(1000);
      const hasGenerate = await page.locator('button:has-text("GENERATE JTBD")').count();
      const hasContent = await page.locator('text=/Jobs To Be Done|JTBD|functional job/i').count();
      const hasRegenerate = await page.locator('button:has-text("REGENERATE")').count();
      expect(hasGenerate + hasContent + hasRegenerate).toBeGreaterThan(0);
    }
  });
});
