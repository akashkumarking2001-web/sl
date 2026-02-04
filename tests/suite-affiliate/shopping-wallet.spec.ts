import { test, expect } from '@playwright/test';

test.describe('Shopping Wallet Feature', () => {

    test.beforeEach(async ({ page }) => {
        // Enable console logging for debugging
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

        // 1. Mock Supabase Responses

        // Mock Agent Income (Balance)
        await page.route('**/rest/v1/agent_income*', async route => {
            const headers = route.request().headers();
            const acceptHeader = headers['accept'] || '';
            const isSingular = acceptHeader.includes('application/vnd.pgrst.object+json');

            const data = { wallet: 2500, referral_income: 500, total_income: 3000, user_id: 'admin-id' };
            const json = isSingular ? data : [data];

            if (route.request().method() === 'GET') {
                await route.fulfill({ json });
            } else {
                await route.continue();
            }
        });

        // Mock Profiles (Basic Info)
        await page.route('**/rest/v1/profiles*', async route => {
            await route.fulfill({ json: [] });
        });

        // Mock Wallet History
        await page.route('**/rest/v1/wallet_history*', async route => {
            await route.fulfill({ json: [] });
        });

        // Mock Shopping Orders (Pending Earnings)
        await page.route('**/rest/v1/shopping_orders*', async route => {
            const url = route.request().url();
            // We can return some mock pending orders if we want to verify the "Pending" badge
            // or return empty for simplicity. Let's return empty for now.
            await route.fulfill({ json: [] });
        });

        // Mock Withdrawal Request Submission
        await page.route('**/rest/v1/withdrawal_requests*', async route => {
            if (route.request().method() === 'POST') {
                const postData = route.request().postDataJSON();
                console.log("Withdrawal Request Payload (Shopping):", postData);
                await route.fulfill({ status: 201, json: { id: 'mock-shop-withdraw-id', status: 'pending' } });
            } else {
                await route.continue();
            }
        });

        // 2. Login Bypass
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
    });

    test('Verify Shopping Wallet Balance and Withdraw Flow', async ({ page }) => {
        console.log("Navigating to Shopping Wallet...");
        await page.goto('/dashboard/shopping-wallet');
        await page.waitForLoadState('networkidle');

        // 3. Verify Balance Display
        console.log("Verifying Balance Display...");
        // Use exact text match for the large balance number
        await expect(page.getByText('₹2,500', { exact: false })).toBeVisible();
        await expect(page.getByText('Current Balance')).toBeVisible();

        // 4. Open Withdrawal Modal
        console.log("Opening Withdrawal Dialog...");
        const withdrawBtn = page.getByRole('button', { name: 'Withdraw' });
        await expect(withdrawBtn).toBeVisible();
        await withdrawBtn.click();

        // 5. Verify Modal Content
        console.log("Verifying Withdrawal Modal...");
        const modal = page.locator('div[role="dialog"]');
        await expect(modal.getByText('Withdraw Earnings')).toBeVisible();

        // 6. Fill Form
        console.log("Filling Form...");
        await modal.getByPlaceholder('Min ₹500').fill('600');
        await modal.getByPlaceholder('Name').fill('Test User');
        await modal.getByPlaceholder('HDFC, SBI...').fill('SBI');
        await modal.getByPlaceholder('Number').fill('9876543210');
        await modal.getByPlaceholder('IFSC').fill('SBI0001234');

        // 7. Submit
        console.log("Submitting Request...");
        await modal.getByRole('button', { name: 'Request Payout' }).click();

        // 8. Verify Success
        console.log("Verifying Success Toast...");
        await expect(page.getByText('Request Submitted', { exact: true })).toBeVisible();
        await expect(page.getByText('Your withdrawal request is pending approval.', { exact: true })).toBeVisible();

        // Dialog should arguably close or the test ends here
    });
});
