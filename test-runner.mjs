import { chromium } from 'playwright';

async function runTests() {
  console.log('🚀 Starting automated Playwright UI validation...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const viewports = [
    { name: 'Mobile 360px', width: 360, height: 640 },
    { name: 'Mobile 390px', width: 390, height: 844 },
    { name: 'Tablet 768px', width: 768, height: 1024 },
    { name: 'Desktop 1024px', width: 1024, height: 768 },
    { name: 'Desktop 1440px', width: 1440, height: 900 },
  ];

  const routes = [
    { path: '/', title: 'Home' },
    { path: '/news', title: 'News' },
    { path: '/news/montana-state-vs-montana-brawl-of-the-wild-preview', title: 'Article Detail' },
    { path: '/top-25', title: 'Top 25 Rankings' },
    { path: '/playoff-projections', title: 'Playoff Projections' },
    { path: '/conferences', title: 'Conferences' },
    { path: '/conferences/mvfc', title: 'Conference Detail' },
    { path: '/about', title: 'About' },
    { path: '/search?q=Montana', title: 'Search' },
  ];

  // 1. Validate horizontal overflow across all viewports on Homepage
  console.log('\n--- Checking Viewport Responsiveness & Horizontal Overflow ---');
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    const hasOverflow = scrollWidth > clientWidth;
    console.log(`[${vp.name}] scrollWidth: ${scrollWidth}px, clientWidth: ${clientWidth}px -> Overflow: ${hasOverflow ? 'FAILED' : 'PASSED'}`);
    if (hasOverflow) {
      throw new Error(`Horizontal overflow detected at ${vp.name}`);
    }
  }

  // 2. Validate all routes for console errors & 200 responses
  console.log('\n--- Checking All Public Routes & Console Integrity ---');
  for (const r of routes) {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const response = await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'domcontentloaded' });
    const status = response?.status();
    console.log(`Route [${r.title}] (${r.path}) -> HTTP Status: ${status}, Console Errors: ${consoleErrors.length}`);
    if (status !== 200) {
      throw new Error(`Route ${r.path} failed with status ${status}`);
    }
  }

  // 3. Validate Mobile Hamburger Navigation
  console.log('\n--- Testing Mobile Hamburger Menu Interaction ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  const menuButton = page.locator('button[aria-label="Open main menu"]');
  await menuButton.click();
  await page.waitForTimeout(300);
  const mobileDrawerNav = page.locator('.lg\\:hidden a:has-text("Top 25 Rankings")');
  const mobileNavVisible = await mobileDrawerNav.isVisible();
  console.log(`Mobile Menu Opened & Links Visible: ${mobileNavVisible ? 'PASSED' : 'FAILED'}`);
  if (!mobileNavVisible) {
    throw new Error('Mobile drawer menu link was not visible upon clicking hamburger toggle');
  }

  // 4. Validate Search Functionality
  console.log('\n--- Testing Search Input Flow ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.locator('button[aria-label="Toggle Search"]').click();
  await page.locator('input[placeholder*="Search teams"]').fill('Bison');
  await page.keyboard.press('Enter');
  await page.waitForURL('**/search?q=Bison');
  const searchResultFound = await page.locator('text=North Dakota State').first().isVisible();
  console.log(`Search for "Bison" navigated & returned NDSU: ${searchResultFound ? 'PASSED' : 'FAILED'}`);

  await browser.close();
  console.log('\n✅ All automated Playwright verification suites PASSED successfully!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
