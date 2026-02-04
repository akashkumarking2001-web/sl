import { test, expect } from '@playwright/test';

test.describe('Admin Course Management Final Verification', () => {

    test('Verify Courses Tab, Normal Courses, and Add Modal', async ({ page }) => {
        // 1. Login Bypass
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        console.log("Navigating to Course Management...");

        // 2. Navigation
        // Use visible filter to avoid strict mode violation (desktop vs mobile sidebar)
        const courseNav = page.getByTestId('nav-item-courses').filter({ visible: true });

        async function clickCourses() {
            // Check count to prevent waiting if completely missing
            if (await courseNav.count() > 0) {
                await courseNav.first().click();
                return true;
            }

            // Fallback: Check if it's in a collapsed menu or just available by text
            const byText = page.locator('button').filter({ hasText: /^Courses$/i }).first();
            if (await byText.isVisible()) {
                await byText.click();
                return true;
            }
            return false;
        }

        if (!await clickCourses()) {
            // Expand Academy if needed? (Not seen in sidebar code, but good practice)
            // Sidebar code showed direct "Courses" item.
            // Maybe mobile?
            console.log("Courses nav not found immediately. Checking mobile sidebar toggle...");
            // If mobile sidebar is closed (lg:hidden logic), on desktop it should be visible.
            // Assuming desktop view (1280x720 default).
            throw new Error("Could not find Courses navigation item");
        }

        // 3. Verify Header
        console.log("Verifying Header...");
        await expect(page.getByText('Course Management')).toBeVisible({ timeout: 10000 });

        // 4. Verify Tabs
        console.log("Verifying Tabs...");
        const planTab = page.getByRole('tab', { name: /Plan Courses/i });
        const normalTab = page.getByRole('tab', { name: 'Normal Courses' });

        await expect(planTab).toBeVisible();
        await expect(normalTab).toBeVisible();

        // 5. Switch to Normal Courses
        console.log("Switching to Normal Courses...");
        await normalTab.click();

        // 6. Click Add New Course
        console.log("Clicking Add New Course...");
        const addBtn = page.getByRole('button', { name: /Add New Course/i });
        await expect(addBtn).toBeVisible();
        await addBtn.click();

        // 7. Verify Modal
        console.log("Verifying Modal...");
        await expect(page.getByText('Upload New Course')).toBeVisible();

        // 8. Verify Fields & Package Options
        // 8. Verify Fields & Package Options
        console.log("Verifying content...");

        // Verify Labels
        await expect(page.getByText('Course Name', { exact: false }).first()).toBeVisible();
        await expect(page.getByText('Price', { exact: false }).first()).toBeVisible();

        // Verify Inputs
        await expect(page.getByPlaceholder('Mastering Digital Marketing')).toBeVisible(); // Course Name Input
        // Price matches standard text input or number, let's look for type="number" inside the modal
        // Or placeholder "499" if available (from CoursesManagement.tsx)
        await expect(page.getByPlaceholder('499')).toBeVisible();

        await expect(page.getByText('Link to Package', { exact: false }).first()).toBeVisible();

        // Check dropdown triggers exist
        const dropdowns = page.locator('button[role="combobox"]');
        await expect(dropdowns).toHaveCount(2);

        console.log("Courses Management verified successfully.");
    });
});
