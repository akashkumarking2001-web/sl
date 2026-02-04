import { test, expect } from '@playwright/test';

test.describe('Health Check', () => {

    test('landing page loads successfully', async ({ page }) => {
        await page.goto('/');

        // Check that we are on the right URL
        await expect(page).toHaveURL('/');

        // Check for essential elements
        // Target the main root element specifically to avoid strict mode violations
        const root = page.locator('#root');
        await expect(root).toBeVisible();

        // Check if title is present (any title)
        const title = await page.title();
        console.log(`Page title: ${title}`);
        expect(title).not.toBe('');
    });

    test('login page contains form', async ({ page }) => {
        await page.goto('/login');

        // Should have an email or username input
        const emailInput = page.locator('input[placeholder*="email" i], input[placeholder*="User ID" i], input[name="email"], input[name="username"]');
        // Use .first() in case there are multiple to avoid strict mode error
        await expect(emailInput.first()).toBeVisible();

        // Should have a password input
        const passwordInput = page.locator('input[type="password"]');
        await expect(passwordInput.first()).toBeVisible();

        // Should have a submit button
        const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
        await expect(submitBtn.first()).toBeVisible();
    });

    test('register page accessible', async ({ page }) => {
        await page.goto('/register');
        // Check url
        await expect(page).toHaveURL(/\/register/);

        // Basic form check
        const input = page.locator('input');
        await expect(input.first()).toBeVisible();
    });

});
