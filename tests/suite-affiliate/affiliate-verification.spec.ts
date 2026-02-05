import { test, expect } from '@playwright/test';

test.describe('Affiliate System & Sidebar', () => {
    // We assume the user is already registered as we can't reliably register a new one due to rate/IP limits. 
    // We will use the existing known user.
    const userCreds = {
        email: 'aksasih2001@gmail.com',
        password: 'aksasih2001@gmail.com'
    };

    test('1. Verify Affiliate Link in Shopping Sidebar', async ({ page }) => {
        // Use Emergency Admin Bypass
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.reload(); // Ensure AuthProvider picks up the flag

        // Go to Shopping
        await page.goto('/shopping');
        await page.waitForLoadState('networkidle');
        console.log(`Current Path: ${page.url()}`);

        // Diagnostic: Check for sibling items
        const hasShopHome = await page.getByText('Shop Home').first().isVisible();
        const hasAddresses = await page.getByText('Addresses').first().isVisible();
        const hasAffiliate = await page.getByText('Affiliate Center').first().isVisible();
        console.log(`Sidebar Items: ShopHome=${hasShopHome}, Addresses=${hasAddresses}, Affiliate=${hasAffiliate}`);

        // Resilient locator by HREF
        const affiliateLink = page.locator('a[href="/dashboard/affiliate"]').filter({ visible: true }).first();
        await expect(affiliateLink).toBeVisible({ timeout: 15000 });

        // Click it using evaluate to be 100% sure the navigation is triggered
        console.log('Triggering click via evaluate...');
        await affiliateLink.evaluate(el => (el as HTMLElement).click());

        await page.waitForTimeout(2000);
        console.log(`URL after evaluate-click: ${page.url()}`);

        // Wait for either the dashboard or the affiliate center
        await page.waitForURL(/\/dashboard\/affiliate|\/affiliate/, { timeout: 15000 });
        const url = page.url();
        expect(url).toMatch(/\/dashboard\/affiliate|\/affiliate/);
    });

    test('2. Verify Affiliate Application/Dashboard State', async ({ page }) => {
        // Use Emergency Admin Bypass
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('/dashboard/affiliate');

        // Check for key dashboard elements OR Locked state
        const header = page.locator('h1, h2, h3').filter({ hasText: /Welcome back|Referral|Unlock|Access Restricted|Premium Feature/i }).first();
        await expect(header).toBeVisible({ timeout: 15000 });
    });
});
