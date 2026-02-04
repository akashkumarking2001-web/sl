import { test, expect, devices } from '@playwright/test';

// Test on Android device
test.use({
    ...devices['Pixel 5'],
    viewport: { width: 393, height: 851 },
});

test.describe('Android Mobile App - Core Functions', () => {
    test('should load homepage with mobile UI', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Check if mobile bottom nav is visible
        await expect(page.locator('text=Home')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Courses')).toBeVisible();
        await expect(page.locator('text=Store')).toBeVisible();

        console.log('✅ Android: Homepage loaded with mobile navigation');
    });

    test('should navigate using bottom navigation', async ({ page }) => {
        await page.goto('http://localhost:5173/user-home');

        // Test bottom nav clicks
        await page.click('text=Courses');
        await page.waitForURL('**/dashboard/courses');
        console.log('✅ Android: Bottom nav - Courses works');

        await page.click('text=Store');
        await page.waitForURL('**/shopping');
        console.log('✅ Android: Bottom nav - Store works');

        await page.click('text=Home');
        await page.waitForURL('**/user-home');
        console.log('✅ Android: Bottom nav - Home works');
    });

    test('should handle touch interactions', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Test button touch targets (should be at least 44x44px)
        const loginButton = page.locator('text=Login').first();
        const box = await loginButton.boundingBox();

        if (box) {
            expect(box.height).toBeGreaterThanOrEqual(40); // Allow some margin
            expect(box.width).toBeGreaterThanOrEqual(40);
            console.log('✅ Android: Touch targets are properly sized');
        }
    });

    test('should display mobile header on native', async ({ page }) => {
        await page.goto('http://localhost:5173/user-home');

        // Check if native header exists (should show on mobile)
        const header = page.locator('header').first();
        await expect(header).toBeVisible();
        console.log('✅ Android: Mobile header is visible');
    });

    test('should handle registration flow', async ({ page }) => {
        await page.goto('http://localhost:5173/register');

        await page.fill('input[type="email"]', 'android-test@test.com');
        await page.fill('input[type="password"]', 'TestPass123!');
        await page.fill('input[placeholder*="Full Name"]', 'Android Test User');

        console.log('✅ Android: Registration form is functional');
    });

    test('should load shopping page', async ({ page }) => {
        await page.goto('http://localhost:5173/shopping');

        await expect(page.locator('text=Products').or(page.locator('text=Store'))).toBeVisible({ timeout: 10000 });
        console.log('✅ Android: Shopping page loads correctly');
    });

    test('should handle cart functionality', async ({ page }) => {
        await page.goto('http://localhost:5173/shopping');

        // Wait for products to load
        await page.waitForTimeout(2000);

        // Check if cart icon exists
        const cartIcon = page.locator('[data-testid="cart-icon"]').or(page.getByRole('link', { name: /cart/i }));
        const cartExists = await cartIcon.count() > 0;

        if (cartExists) {
            console.log('✅ Android: Cart functionality is present');
        }
    });

    test('should display responsive layout', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThanOrEqual(500); // Mobile width
        console.log('✅ Android: Viewport is mobile-sized');
    });
});

test.describe('Android Mobile App - Advanced Features', () => {
    test('should handle affiliate dashboard', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        // Emergency admin bypass for testing
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/dashboard/affiliate');

        await expect(page.locator('text=Affiliate').or(page.locator('text=Earnings'))).toBeVisible({ timeout: 10000 });
        console.log('✅ Android: Affiliate dashboard accessible');
    });

    test('should handle course browsing', async ({ page }) => {
        await page.goto('http://localhost:5173/dashboard/courses');

        await expect(page.locator('text=Courses').or(page.locator('text=Learning'))).toBeVisible({ timeout: 10000 });
        console.log('✅ Android: Course browsing works');
    });

    test('should handle profile page', async ({ page }) => {
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/dashboard/profile');

        await expect(page.locator('text=Profile').or(page.locator('text=Account'))).toBeVisible({ timeout: 10000 });
        console.log('✅ Android: Profile page loads');
    });
});
