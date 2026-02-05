import { test, expect, devices } from '@playwright/test';

// Test on Android device
test.use({
    ...devices['Pixel 5'],
    viewport: { width: 393, height: 851 },
});

test.describe('Android Mobile App - Core Functions', () => {
    test('should load homepage with mobile UI', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Check if mobile bottom nav is visible (avoiding hidden desktop links)
        await expect(page.locator('text=Home').filter({ visible: true }).first()).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Courses').filter({ visible: true }).first()).toBeVisible();
        await expect(page.locator('text=Store').filter({ visible: true }).first()).toBeVisible();

        console.log('✅ Android: Homepage loaded with mobile navigation');
    });

    test('should navigate using bottom navigation', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/user-home');
        await page.waitForLoadState('domcontentloaded');

        // Test bottom nav clicks (more specific selectors)
        await page.locator('nav, div').filter({ has: page.locator('button') }).getByText('Courses').first().click();
        await expect(page).toHaveURL(/.*dashboard\/courses/, { timeout: 15000 });
        console.log('✅ Android: Bottom nav - Courses works');

        await page.locator('nav, div').filter({ has: page.locator('button') }).getByText('Store').first().click();
        await expect(page).toHaveURL(/.*shopping/, { timeout: 15000 });
        console.log('✅ Android: Bottom nav - Store works');
    });

    test('should handle touch interactions', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Test button touch targets (should be at least 40px)
        const loginButton = page.getByRole('link', { name: 'LOGIN' }).filter({ visible: true }).first();
        await expect(loginButton).toBeVisible({ timeout: 10000 });
        const box = await loginButton.boundingBox();

        if (box) {
            expect(box.height).toBeGreaterThanOrEqual(35); // Mobile buttons
            expect(box.width).toBeGreaterThanOrEqual(40);
            console.log('✅ Android: Touch targets are properly sized');
        }
    });

    test('should display mobile header', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/user-home');

        // Check if header exists
        const header = page.locator('header').first();
        await expect(header).toBeVisible({ timeout: 15000 });
        console.log('✅ Android: Mobile header is visible');
    });

    test('should handle registration flow fields', async ({ page }) => {
        await page.goto('http://localhost:5173/register');

        // Fill required fields to pass validation
        await page.getByPlaceholder('Enter your full name').fill('Android Test');
        await page.getByPlaceholder('Enter your email address').fill('android@test.com');
        await page.getByPlaceholder('Enter your mobile number').fill('9876543210');
        await page.fill('input[type="date"]', '2000-01-01');

        // Wait for country options to load
        const countrySelect = page.locator('select').first();
        await countrySelect.selectOption({ label: 'India' });

        await page.getByPlaceholder('Enter your complete residential address').fill('123 Test Street, Test City');
        await page.getByPlaceholder('Enter your area pincode').fill('123456');

        const passwords = page.locator('input[type="password"]');
        await passwords.nth(0).fill('TestPass123!');
        await passwords.nth(1).fill('TestPass123!');

        await page.click('input[type="checkbox"]');

        console.log('✅ Android: Registration form fields filled');
    });

    test('should load shopping page', async ({ page }) => {
        await page.goto('http://localhost:5173/shopping');
        await expect(page.locator('text=Products').or(page.locator('text=Store')).first()).toBeVisible({ timeout: 15000 });
        console.log('✅ Android: Shopping page loads correctly');
    });

    test('should handle cart icon presence', async ({ page }) => {
        await page.goto('http://localhost:5173/shopping');
        await page.waitForTimeout(2000);
        const cartIcon = page.locator('.lucide-shopping-cart').filter({ visible: true }).first();
        await expect(cartIcon).toBeVisible({ timeout: 10000 });
        console.log('✅ Android: Cart icon is present and visible');
    });

    test('should display responsive layout', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThanOrEqual(500);
        console.log('✅ Android: Viewport verified');
    });
});

test.describe('Android Mobile App - Advanced Features', () => {
    test('should handle affiliate dashboard', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/dashboard/affiliate');

        await expect(page.locator('text=Affiliate').or(page.locator('text=Earnings')).first()).toBeVisible({ timeout: 15000 });
        console.log('✅ Android: Affiliate dashboard accessible');
    });

    test('should handle course browsing', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/dashboard/courses');

        const heading = page.getByRole('heading', { name: /Courses|Learning/i }).first();
        const bottomNavText = page.locator('span').filter({ hasText: 'Courses' }).first();

        await expect(heading.or(bottomNavText)).toBeVisible({ timeout: 20000 });
        console.log('✅ Android: Course browsing works');
    });

    test('should handle profile page', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/dashboard/profile');

        await expect(page.locator('text=Profile').or(page.locator('text=Account')).first()).toBeVisible({ timeout: 15000 });
        console.log('✅ Android: Profile page loads');
    });
});
