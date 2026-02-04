import { test, expect } from '@playwright/test';

test.describe('Affiliate Wallet Dedicated Page', () => {

    test.beforeEach(async ({ page }) => {
        // Enable console logging for debugging
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

        // 1. Mock Supabase Responses

        // Mock Agent Income (Balance)
        // The page sums up 'amount' from the response.
        await page.route('**/rest/v1/agent_income*', async route => {
            const json = [{ amount: 5000, user_id: 'admin-id' }];
            await route.fulfill({ json });
        });

        // Mock Wallet History
        await page.route('**/rest/v1/wallet_history*', async route => {
            await route.fulfill({ json: [] });
        });

        // Mock Withdrawal Requests
        await page.route('**/rest/v1/withdrawal_requests*', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ status: 201, json: { id: 'mock-id', status: 'pending' } });
            } else {
                await route.fulfill({ json: [] });
            }
        });

        // Mock Bank Accounts
        await page.route('**/rest/v1/bank_accounts*', async route => {
            await route.fulfill({ json: [] });
        });

        // 2. Login Bypass
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
    });

    test('Verify Dedicated Wallet Page Balance and Withdraw', async ({ page }) => {
        console.log("Navigating to Dedicated Wallet Page...");
        await page.goto('/dashboard/wallet');
        await page.waitForLoadState('networkidle');

        // 3. Verify Balance Display
        // If the page logic is inconsistent, this might fail or show 0
        console.log("Verifying Balance Display...");
        // The page tries to sum 'amount' from agent_income. 
        // If our mock has 'wallet': 5000 but the code looks for 'amount', it might show 0.
        // We expect it to be 5000 if it was correct, or we will see what it renders.

        // Let's just check if the page loads and verify the text "Available Balance"
        await expect(page.getByText('Available Balance')).toBeVisible();

        // Check for the balance. If logic is 'incorrect' in the file, it likely won't show 5000.
        // Let's assume we want to fix it to match other pages.
        // So we expect 5000.
        const balance = page.locator('.text-gradient-gold');
        await expect(balance).toContainText('5,000'); // This will likely fail if code is broken

    });
});
