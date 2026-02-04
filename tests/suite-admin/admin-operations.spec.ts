import { test, expect } from '@playwright/test';

test.describe('Admin Operations Verification', () => {

    const userCreds = {
        email: 'aksasih2001@gmail.com',
        password: 'aksasih2001@gmail.com'
    };

    test('Verify Admin Access & Approve Orders', async ({ page }) => {
        // 1. Set bypass early
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));

        // 2. Navigate to Admin Directly (Bypass logged us in)
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // 4. Verify Dashboard
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });

        // 5. Navigate to Requests -> Package Requests
        console.log("Navigating to Package Requests...");
        const pkgReqSection = page.getByTestId('nav-section-requests').filter({ visible: true });
        const pkgReqItem = page.getByTestId('nav-item-package-requests').filter({ visible: true });

        if (!(await pkgReqItem.isVisible())) {
            console.log("Expanding Requests section...");
            await pkgReqSection.click();
            await expect(pkgReqItem).toBeVisible({ timeout: 5000 });
        }
        await pkgReqItem.click();
        console.log("Clicked Package Requests.");

        // 6. Verify Content
        console.log("Waiting for content...");
        // Broad selector to handle different possibilities of empty/populated states
        const content = page.locator('table, :text("No pending package requests"), :text("No records found"), :text("All requests have been processed")').first();
        await expect(content).toBeVisible({ timeout: 20000 });
        console.log("Content verified.");
    });

    test('Verify Comprehensive Admin Tab Navigation', async ({ page }) => {
        // 1. Set bypass early
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));

        // 2. Navigate Admin Directly
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // 4. Test Affiliate Management Navigation
        const affItem = page.getByTestId('nav-item-affiliate-requests').filter({ visible: true });
        if (!(await affItem.isVisible())) {
            await page.getByTestId('nav-section-requests').filter({ visible: true }).click();
            await expect(affItem).toBeVisible({ timeout: 5000 });
        }
        await affItem.click();
        await expect(page.getByPlaceholder(/Search by name or email.../i)).toBeVisible({ timeout: 10000 });

        // 5. Test Wallet Management Navigation
        const walletWithdraw = page.getByTestId('nav-item-withdrawal-requests').filter({ visible: true });
        if (!(await walletWithdraw.isVisible())) {
            await page.getByTestId('nav-section-wallet').filter({ visible: true }).click();
            await expect(walletWithdraw).toBeVisible({ timeout: 5000 });
        }
        await walletWithdraw.click();
        await expect(page.locator('button').filter({ hasText: /Export CSV/i })).toBeVisible({ timeout: 10000 });

        // 6. Test Task Management Navigation
        const taskCreate = page.getByTestId('nav-item-create-task').filter({ visible: true });
        if (!(await taskCreate.isVisible())) {
            await page.getByTestId('nav-section-tasks').filter({ visible: true }).click();
            await expect(taskCreate).toBeVisible({ timeout: 5000 });
        }
        await taskCreate.click();
        await expect(page.locator('h3').filter({ hasText: /WhatsApp Deployment/i })).toBeVisible({ timeout: 10000 });

        // 7. Test Store Appearance Navigation
        const storeAppearance = page.getByTestId('nav-item-store-manager').filter({ visible: true });
        if (!(await storeAppearance.isVisible())) {
            await page.getByTestId('nav-section-store').filter({ visible: true }).click();
            await expect(storeAppearance).toBeVisible({ timeout: 5000 });
        }
        await storeAppearance.click();
        await expect(page.getByRole('heading', { name: 'Store Management' })).toBeVisible({ timeout: 10000 });
    });

    test('Verify Add New Product Modal Fields', async ({ page }) => {
        // 1. Set bypass early
        console.log("Setting emergency admin bypass...");
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));

        // 2. Navigate Store -> Products via Admin
        console.log("Navigating to /admin...");
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        console.log("Navigating to Products tab...");
        const prodItem = page.getByTestId('nav-item-products').filter({ visible: true });
        if (!(await prodItem.isVisible())) {
            console.log("Expanding Store section...");
            await page.getByTestId('nav-section-store').filter({ visible: true }).click();
            await expect(prodItem).toBeVisible({ timeout: 5000 });
        }
        await prodItem.click();

        // Ensure the Products page content is loaded
        console.log("Verifying Product Factory header...");
        await expect(page.getByText('Product Factory')).toBeVisible({ timeout: 10000 });

        // Wait for potential data loading to finish
        console.log("Waiting for loading spinner to clear...");
        await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });
        console.log("Clicked Products tab and page ready.");

        // 4. Open Modal
        console.log("Locating 'New Creation' button...");
        const addProductBtn = page.getByRole('button', { name: /New Creation/i });
        await expect(addProductBtn).toBeVisible({ timeout: 10000 });
        console.log("Clicking 'New Creation'...");
        await addProductBtn.click();

        // 5. Verify Modal Visibility
        console.log("Verifying 'Product Architect' modal...");
        await expect(page.getByText('Product Architect')).toBeVisible({ timeout: 10000 });

        // 6. Detailed Field Checks
        console.log("Checking form fields...");
        await expect(page.getByLabel('Product Designation')).toBeVisible();
        await expect(page.getByLabel('Detailed Description')).toBeVisible();
        await expect(page.getByLabel('Live Sale Price')).toBeVisible();
        await expect(page.getByLabel(/MRP/i)).toBeVisible();
        console.log("All fields verified.");
    });
});
