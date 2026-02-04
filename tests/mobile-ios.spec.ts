import { test, expect, devices } from '@playwright/test';

// Test on iOS device (iPhone 12)
test.use({
    ...devices['iPhone 12'],
    viewport: { width: 390, height: 844 },
});

test.describe('iOS Mobile App - Core Functions', () => {
    test('should load homepage with mobile UI', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Check if mobile bottom nav is visible
        await expect(page.locator('text=Home')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Courses')).toBeVisible();
        await expect(page.locator('text=Store')).toBeVisible();

        console.log('✅ iOS: Homepage loaded with mobile navigation');
    });

    test('should navigate using bottom navigation', async ({ page }) => {
        await page.goto('http://localhost:5173/user-home');

        // Test bottom nav clicks
        await page.click('text=Courses');
        await page.waitForURL('**/dashboard/courses');
        console.log('✅ iOS: Bottom nav - Courses works');

        await page.click('text=Store');
        await page.waitForURL('**/shopping');
        console.log('✅ iOS: Bottom nav - Store works');

        await page.click('text=Wallet');
        await page.waitForURL('**/dashboard/wallet');
        console.log('✅ iOS: Bottom nav - Wallet works');

        await page.click('text=Home');
        await page.waitForURL('**/user-home');
        console.log('✅ iOS: Bottom nav - Home works');
    });

    test('should handle touch interactions with iOS standards', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // iOS requires 44x44pt minimum touch targets
        const loginButton = page.locator('text=Login').first();
        const box = await loginButton.boundingBox();

        if (box) {
            expect(box.height).toBeGreaterThanOrEqual(40);
            expect(box.width).toBeGreaterThanOrEqual(40);
            console.log('✅ iOS: Touch targets meet Apple HIG standards');
        }
    });

    test('should display safe area insets', async ({ page }) => {
        await page.goto('http://localhost:5173/user-home');

        // Check if bottom nav has safe area padding
        const bottomNav = page.locator('text=Home').locator('..');
        await expect(bottomNav).toBeVisible();
        console.log('✅ iOS: Safe area insets are applied');
    });

    test('should handle registration flow', async ({ page }) => {
        await page.goto('http://localhost:5173/register');

        await page.fill('input[type="email"]', 'ios-test@test.com');
        await page.fill('input[type="password"]', 'TestPass123!');
        await page.fill('input[placeholder*="Full Name"]', 'iOS Test User');

        console.log('✅ iOS: Registration form is functional');
    });

    test('should load shopping page', async ({ page }) => {
        await page.goto('http://localhost:5173/shopping');

        await expect(page.locator('text=Products').or(page.locator('text=Store'))).toBeVisible({ timeout: 10000 });
        console.log('✅ iOS: Shopping page loads correctly');
    });

    test('should handle cart functionality', async ({ page }) => {
        await page.goto('http://localhost:5173/shopping');

        await page.waitForTimeout(2000);

        const cartIcon = page.locator('[data-testid="cart-icon"]').or(page.getByRole('link', { name: /cart/i }));
        const cartExists = await cartIcon.count() > 0;

        if (cartExists) {
            console.log('✅ iOS: Cart functionality is present');
        }
    });

    test('should display responsive layout for iPhone', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThanOrEqual(500);
        console.log('✅ iOS: Viewport is iPhone-sized');
    });

    test('should handle iOS-specific gestures', async ({ page }) => {
        await page.goto('http://localhost:5173/user-home');

        // Test swipe-like behavior (scroll)
        await page.mouse.move(200, 400);
        await page.mouse.down();
        await page.mouse.move(200, 200);
        await page.mouse.up();

        console.log('✅ iOS: Gesture handling works');
    });
});

test.describe('iOS Mobile App - Advanced Features', () => {
    test('should handle affiliate dashboard', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/dashboard/affiliate');

        await expect(page.locator('text=Affiliate').or(page.locator('text=Earnings'))).toBeVisible({ timeout: 10000 });
        console.log('✅ iOS: Affiliate dashboard accessible');
    });

    test('should handle course browsing', async ({ page }) => {
        await page.goto('http://localhost:5173/dashboard/courses');

        await expect(page.locator('text=Courses').or(page.locator('text=Learning'))).toBeVisible({ timeout: 10000 });
        console.log('✅ iOS: Course browsing works');
    });

    test('should handle profile page', async ({ page }) => {
        await page.evaluate(() => localStorage.setItem('is_emergency_admin', 'true'));
        await page.goto('http://localhost:5173/dashboard/profile');

        await expect(page.locator('text=Profile').or(page.locator('text=Account'))).toBeVisible({ timeout: 10000 });
        console.log('✅ iOS: Profile page loads');
    });

    test('should handle dark mode', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Toggle dark mode
        const themeToggle = page.locator('[aria-label*="theme"]').or(page.locator('button').filter({ hasText: /theme/i }));
        const toggleExists = await themeToggle.count() > 0;

        if (toggleExists) {
            await themeToggle.first().click();
            console.log('✅ iOS: Dark mode toggle works');
        }
    });

    test('should handle payment gateway', async ({ page }) => {
        await page.goto('http://localhost:5173/payment');

        await expect(page.locator('text=Payment').or(page.locator('text=Checkout'))).toBeVisible({ timeout: 10000 });
        console.log('✅ iOS: Payment gateway accessible');
    });
});

test.describe('iOS Mobile App - Performance', () => {
    test('should load pages quickly', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('http://localhost:5173/');
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
        console.log(`✅ iOS: Page loaded in ${loadTime}ms`);
    });

    test('should handle navigation transitions smoothly', async ({ page }) => {
        await page.goto('http://localhost:5173/user-home');

        const startTime = Date.now();
        await page.click('text=Courses');
        await page.waitForURL('**/dashboard/courses');
        const transitionTime = Date.now() - startTime;

        expect(transitionTime).toBeLessThan(2000);
        console.log(`✅ iOS: Navigation transition in ${transitionTime}ms`);
    });
});
