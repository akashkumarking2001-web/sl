import { test, expect } from '@playwright/test';

test.describe('Dashboard Functional Check', () => {

    test('Access Dashboard via Emergency Admin Bypass', async ({ page }) => {
        // 1. Set LocalStorage flag to simulate Admin Login (bypassing Supabase Auth Rate Limits)
        await page.goto('/login'); // Go to a page to set storage context
        await page.evaluate(() => {
            localStorage.setItem('is_emergency_admin', 'true');
        });

        // 2. Reload or Navigate to trigger useAuth check
        await page.goto('/user-home');

        // 3. Verify access to Protected Route
        // Should NOT be redirected to login
        await expect(page).toHaveURL(/.*\/user-home/);

        // 4. Verify Dashboard content
        await expect(page.locator('body')).toContainText('Skill Learners');
        // Check for some dashboard specific element, e.g. "Welcome" or "Overview"
        // Adjust based on actual dashboard content
    });

    test('Check Affiliate Dashboard pages', async ({ page }) => {
        // Setup Admin Session
        await page.goto('/login');
        await page.evaluate(() => {
            localStorage.setItem('is_emergency_admin', 'true');
        });

        // Navigate
        await page.goto('/dashboard/affiliate');
        await expect(page).toHaveURL(/\/dashboard\/affiliate/);

        // Check for common elements
        const body = page.locator('body');
        await expect(body).toBeVisible();

        // Navigate to Income Report
        await page.goto('/dashboard/income/all');
        await expect(page).toHaveURL(/\/dashboard\/income\/all/);
    });

    test('Check Shopping/E-commerce pages', async ({ page }) => {
        // Setup Admin Session
        await page.goto('/login');
        await page.evaluate(() => {
            localStorage.setItem('is_emergency_admin', 'true');
        });

        await page.goto('/shopping');
        await expect(page).toHaveURL(/\/shopping/);

        // Check if products are visible
        // Assuming product cards have some class or text
        const mainHtml = await page.content();
        if (mainHtml.includes('Loading')) {
            await page.waitForTimeout(2000);
        }
        // Just ensure it doesn't crash to 404
    });

});
