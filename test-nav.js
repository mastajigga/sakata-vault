const { chromium } = require('playwright'); // if playwright is installed

async function testNavbarLinks() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  const linksToTest = [
    '/savoir',
    '/forum',
    '/premium',
    '/auth',
    '/'
  ];

  for(const href of linksToTest) {
    console.log(`[TEST] Navigating to ${href}`);
    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 8000 }).catch(() => console.log('Navigation timeout, might be slow')),
        page.click(`a[href="${href}"]`)
      ]);
      await page.waitForTimeout(4000);
      
      const content = await page.content();
      const hasLoading = content.toLowerCase().includes('animate-spin') || content.toLowerCase().includes('chargement');
      console.log(`[RESULT] ${href} -> Loading text visible: ${hasLoading}, Title: ${await page.title()}`);
    } catch(e) {
      console.error(`[ERROR] clicking ${href}: ${e.message}`);
    }
  }

  await browser.close();
}

testNavbarLinks();
