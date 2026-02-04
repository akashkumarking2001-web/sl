import { test, expect } from '@playwright/test';

test.describe('Affiliate System & Sidebar', () => {
    // We assume the user is already registered as we can't reliably register a new one due to rate/IP limits. 
    // We will use the existing known user.
    const userCreds = {
        email: 'aksasih2001@gmail.com',
        password: 'aksasih2001@gmail.com'
    };

    test('1. Verify Affiliate Link in Shopping Sidebar', async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[placeholder*="Enter email"]', userCreds.email);
        await page.fill('input[placeholder="Enter your password"]', userCreds.password);
        await page.locator('button[type="submit"]').filter({ hasText: 'Login' }).click();
        await page.waitForURL(/.*\/user-home|.*\/dashboard/, { timeout: 30000 });

        // Go to Shopping
        await page.goto('/shopping');
        await page.waitForURL(/.*\/shopping/);

        // Check Sidebar for "Affiliate Center"
        // Note: ShoppingSidebar might be hidden on mobile, so we set viewport to desktop
        await page.setViewportSize({ width: 1280, height: 720 });

        const affiliateLink = page.locator('aside').locator('a[href="/dashboard/affiliate"]');
        await expect(affiliateLink).toBeVisible();
        await expect(affiliateLink).toContainText('Affiliate Center');

        // Click with force to bypass potential overlay interruptions in test env
        await affiliateLink.click({ force: true });

        // Wait for either the dashboard or the affiliate center
        await page.waitForURL(/\/dashboard\/affiliate|\/affiliate/, { timeout: 15000 });
        const url = page.url();
        expect(url).toMatch(/\/dashboard\/affiliate|\/affiliate/);
    });

    test('2. Verify Affiliate Application/Dashboard State', async ({ page }) => {
        // Reuse login
        await page.goto('/login');
        await page.fill('input[placeholder*="Enter email"]', userCreds.email);
        await page.fill('input[placeholder="Enter your password"]', userCreds.password);
        await page.locator('button[type="submit"]').filter({ hasText: 'Login' }).click();
        await page.waitForURL(/.*\/user-home|.*\/dashboard/, { timeout: 30000 });

        await page.goto('/dashboard/affiliate');

        // Check for key dashboard elements OR Locked state
        // The user might be locked if they haven't purchased a plan yet.
        const header = page.locator('h1, h2, h3').filter({ hasText: /Welcome back|Referral|Unlock|Access Restricted|Premium Feature/i }).first();
        await expect(header).toBeVisible();
    });
});
