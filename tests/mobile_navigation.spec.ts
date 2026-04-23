import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile Navigation and Visuals', () => {
  test('should navigate through main pages on mobile', async ({ page }) => {
    // 1. Home Page
    console.log('Testing Home Page...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Sakata/);
    
    // Check if the logo is visible
    const logo = page.locator('a:has-text("SAKATA")');
    await expect(logo).toBeVisible();

    // 2. Open Mobile Menu
    console.log('Opening Mobile Menu...');
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    
    // Verify menu items
    const forumLink = page.locator('nav >> text="Le Forum"');
    await expect(forumLink).toBeVisible();
    
    // 3. Navigate to Forum
    console.log('Navigating to Forum...');
    await forumLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*forum/);
    
    // 4. Check for horizontal overflow (visual bug check)
    console.log('Checking for horizontal overflow...');
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (overflow) {
      console.warn('Horizontal overflow detected!');
    }
    expect(overflow).toBe(false);

    // 5. Navigate to a category
    console.log('Navigating to a category...');
    const firstCategory = page.locator('a[href^="/forum/"]').first();
    if (await firstCategory.count() > 0) {
      await firstCategory.click();
      await page.waitForLoadState('networkidle');
      
      // 6. Check Category Page visuals
      console.log('Checking Category Page visuals...');
      const catTitle = page.locator('h1');
      await expect(catTitle).toBeVisible();
    }

    console.log('Mobile navigation test completed successfully.');
  });
});
