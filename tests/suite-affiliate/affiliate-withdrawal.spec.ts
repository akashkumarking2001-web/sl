import { test, expect } from '@playwright/test';

test.describe('Affiliate Withdrawal Feature', () => {

    test.beforeEach(async ({ page }) => {
        // Enable console logging for debugging
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

        // 1. Mock Supabase Responses to simulate a user with balance

        // Mock Affiliate Application Check
        await page.route('**/rest/v1/affiliate_applications*', async route => {
            const json = [{ status: 'approved', user_id: 'admin-id' }];
            await route.fulfill({ json });
        });

        // Mock Agent Income (Balance)
        await page.route('**/rest/v1/agent_income*', async route => {
            const headers = route.request().headers();
            const acceptHeader = headers['accept'] || '';
            const isSingular = acceptHeader.includes('application/vnd.pgrst.object+json');

            if (route.request().method() === 'GET') {
                const data = { wallet: 5000, referral_income: 1000, total_income: 6000, user_id: 'admin-id' };
                // If .single() is called, return object. Else return array.
                const json = isSingular ? data : [data];
                await route.fulfill({ json });
            } else {
                await route.continue();
            }
        });

        // Mock Wallet History (for stats)
        await page.route('**/rest/v1/wallet_history*', async route => {
            // Return empty history or mock data
            await route.fulfill({ json: [] });
        });

        // Mock Affiliate Clicks
        await page.route('**/rest/v1/affiliate_clicks*', async route => {
            await route.fulfill({ json: [], headers: { 'content-range': '0-0/0' } });
        });

        // Mock Products (for link generator)
        await page.route('**/rest/v1/products*', async route => {
            await route.fulfill({ json: [] });
        });

        // Mock Withdrawal Request Submission
        // Added wildcard to ensure it matches even if query params are appended unexpectedly
        await page.route('**/rest/v1/withdrawal_requests*', async route => {
            if (route.request().method() === 'POST') {
                const postData = route.request().postDataJSON();
                console.log("Withdrawal Request Payload:", postData);
                await route.fulfill({ status: 201, json: { id: 'mock-withdrawal-id', status: 'pending' } });
            } else {
                await route.continue();
            }
        });

        // 2. Login Bypass
        // We use the emergency admin flag which sets a user with id 'admin-id'
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
    });

    test('Verify Wallet Balance and Withdrawal Submission', async ({ page }) => {
        console.log("Navigating to Affiliate Earnings Dashboard...");
        await page.goto('/dashboard/affiliate-earnings');
        await page.waitForLoadState('networkidle');

        // 3. Verify Balance Display
        // Stats are loaded from our mock agent_income
        console.log("Verifying Balance Display...");
        const balanceDisplay = page.getByText('₹5,000');
        await expect(balanceDisplay.first()).toBeVisible();
        await expect(page.getByText('Available Balance')).toBeVisible();

        // 4. Open Withdrawal Modal
        console.log("Opening Withdrawal Dialog...");
        const withdrawBtn = page.getByRole('button', { name: 'Withdraw' });
        await expect(withdrawBtn).toBeVisible();
        await withdrawBtn.click();

        // 5. Verify Modal Content
        console.log("Verifying Withdrawal Modal...");
        const modal = page.locator('div[role="dialog"]');
        await expect(modal.getByText('Request Withdrawal')).toBeVisible();
        await expect(modal.getByText('Available Balance')).toBeVisible();
        // Check input existence
        await expect(page.getByPlaceholder('Enter amount...')).toBeVisible();
        await expect(page.getByPlaceholder('Account Holder Name')).toBeVisible();

        // 6. Attempt Withdrawal (Validation Check)
        // Submit empty
        await page.getByRole('button', { name: 'Submit Request' }).click();
        // Expect error toast (Implementation details might vary, checking if dialog stays open)
        await expect(page.getByText('Request Withdrawal')).toBeVisible();

        // 7. Fill Form Correctly
        console.log("Filling Withdrawal Form...");
        await page.getByPlaceholder('Enter amount...').fill('1000');
        await page.getByPlaceholder('Account Holder Name').fill('John Doe');
        await page.getByPlaceholder('Account Number').fill('1234567890');
        await page.getByPlaceholder('IFSC Code').fill('HDFC0001234');
        await page.getByPlaceholder('Bank Name').fill('HDFC Bank');

        // 8. Submit
        console.log("Submitting Request...");
        await page.getByRole('button', { name: 'Submit Request' }).click();

        // 9. Verify Success
        // Wait for Toast
        console.log("Verifying Success Toast...");
        await expect(page.getByText('Withdrawal Requested', { exact: true })).toBeVisible();
        await expect(page.getByText('Your request has been submitted for approval.', { exact: true })).toBeVisible();

        // Dialog should close
        // Use the modal variable we defined earlier or locate it again, 
        // asking for it NOT to be visible might need careful handling if multiple 'Request Withdrawal' exist.
        // But here we want to ensure the DIALOG is gone.
        // verifying text 'Request Withdrawal' is not visible might be tricky if it's on the page behind it?
        // Actually 'Request Withdrawal' is the title of the dialog. It shouldn't be on the page elsewhere.
        await expect(page.getByText('Request Withdrawal')).not.toBeVisible();

        console.log("Withdrawal Flow Verified Successfully.");
    });
});
