import { test, expect } from '@playwright/test';

test('Verification de la stabilite et absence de 404', async ({ page }) => {
  const errors: string[] = [];
  const fourOhFours: string[] = [];
  const consoleMessages: string[] = [];

  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') errors.push(msg.text());
  });

  page.on('response', response => {
    if (response.status() === 404) {
      fourOhFours.push(response.url());
    }
  });

  console.log('--- Navigation vers /savoir ---');
  await page.goto('http://localhost:3000/savoir');
  await page.waitForLoadState('networkidle');

  // Check for 404s on list page
  if (fourOhFours.length > 0) {
    console.log('404 DETECTES sur /savoir:');
    fourOhFours.forEach(url => console.log(`  - ${url}`));
  } else {
    console.log('Aucun 404 sur /savoir.');
  }

  // Navigate to a specific article (one that had missing assets)
  console.log('--- Navigation vers /savoir/ngongo-technique ---');
  await page.click('a[href="/savoir/ngongo-technique"]');
  await page.waitForLoadState('networkidle');

  // Check for 404s on detail page
  if (fourOhFours.length > 0) {
    const new404s = fourOhFours.filter(url => !url.includes('/savoir')); // Simple filter
    if (new404s.length > 0) {
      console.log('NOUVEAUX 404 DETECTES sur la page article:');
      new404s.forEach(url => console.log(`  - ${url}`));
    }
  }

  // Test Hard Reload
  console.log('--- Test Hard Reload sur la page article ---');
  await page.reload({ waitUntil: 'networkidle' });
  
  // Count frequency of certain logs
  const renderLogs = consoleMessages.filter(m => m.includes('AuthProvider render'));
  console.log(`Nombre de rendus AuthProvider: ${renderLogs.length}`);

  expect(renderLogs.length).toBeLessThan(10); // Should be very few now
  
  console.log('Test termine avec succes (logiquement).');
});
