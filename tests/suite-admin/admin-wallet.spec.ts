import { test, expect } from '@playwright/test';

test.describe('Admin Wallet Management', () => {

    test.beforeEach(async ({ page }) => {
        // Login Bypass
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');
    });

    test('Verify Wallet Navigation and Adjust Balance Page', async ({ page }) => {
        console.log("Navigating to Wallet Section...");

        // 1. Open Wallet Section
        // Use visible filter to avoid mobile duplications or ensure we get the right one
        const walletSection = page.getByTestId('nav-section-wallet').filter({ visible: true });

        // Use specific test ID for Adjust Balance to avoid ambiguity
        const adjustBalanceNav = page.getByTestId('nav-item-adjust-balance').filter({ visible: true });

        if (!await adjustBalanceNav.isVisible()) {
            console.log("Wallet section might be collapsed, clicking to expand...");
            if (await walletSection.isVisible()) {
                await walletSection.click();
            } else {
                // Fallback
                await page.locator('button').filter({ hasText: /^Wallet$/i }).filter({ visible: true }).click();
            }
        }

        // 2. Click Adjust Balance
        console.log("Clicking Adjust Balance...");
        await expect(adjustBalanceNav).toBeVisible();
        await adjustBalanceNav.click();

        // 3. Verify Adjust Balance Page
        console.log("Verifying Adjust Balance Form...");
        await expect(page.getByText('Adjust Wallet Balance')).toBeVisible();

        // 4. Verify Form Fields
        // Use placeholders which are more reliable here
        await expect(page.getByPlaceholder('Enter email or ID')).toBeVisible();
        await expect(page.getByText('Search User', { exact: false })).toBeVisible();

        await expect(page.getByPlaceholder('Enter amount')).toBeVisible();
        await expect(page.getByPlaceholder('Enter reason for adjustment')).toBeVisible();

        // Verify Income Type Select
        await expect(page.getByText('Income Type')).toBeVisible();
        const incomeSelect = page.locator('button[role="combobox"]');
        await expect(incomeSelect).toBeVisible();

        // Verify Content of Income Type Select
        await incomeSelect.click();
        await expect(page.getByRole('option', { name: 'Main Wallet' })).toBeVisible();
        await expect(page.getByRole('option', { name: 'Referral Income' })).toBeVisible();

        // Close select
        await page.keyboard.press('Escape');

        // 5. Verify Actions
        await expect(page.getByRole('button', { name: 'Add Funds' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Deduct' })).toBeVisible();

        console.log("Adjust Balance page verified.");
    });

    test('Verify Deposit Requests View', async ({ page }) => {
        console.log("Navigating to Deposit Requests...");

        const walletSection = page.getByTestId('nav-section-wallet').filter({ visible: true });
        // Use specific test ID for Deposit Requests
        const depositNav = page.getByTestId('nav-item-deposit-requests').filter({ visible: true });

        if (!await depositNav.isVisible()) {
            if (await walletSection.isVisible()) await walletSection.click();
            else await page.locator('button').filter({ hasText: /^Wallet$/i }).filter({ visible: true }).click();
        }

        await depositNav.click();

        console.log("Verifying Deposit Requests Table...");
        // Check for table headers
        await expect(page.getByRole('columnheader', { name: 'Agent' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Amount' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Transaction ID' })).toBeVisible(); // Specific to Add/Deposit

        // Check for Export button
        await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible();
    });
});
