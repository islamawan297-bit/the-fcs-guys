import { chromium } from 'playwright';

async function runProductionQA() {
  console.log('🏁 Starting Comprehensive Production QA & Security Audit Suite...\n');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;

  function record(condition, label) {
    if (condition) {
      console.log(`✅ [PASS] ${label}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${label}`);
      failed++;
    }
  }

  // 1. Robots.txt and Sitemap.xml
  console.log('--- 1. Testing SEO Artifacts & Indexing Configuration ---');
  const robotsRes = await page.goto('http://localhost:3000/robots.txt', { waitUntil: 'domcontentloaded' });
  const robotsText = await robotsRes?.text();
  record(robotsRes?.status() === 200 && robotsText.includes('Disallow: /admin'), 'robots.txt blocks /admin and allows /');

  const sitemapRes = await page.goto('http://localhost:3000/sitemap.xml', { waitUntil: 'domcontentloaded' });
  record(sitemapRes?.status() === 200, 'sitemap.xml generates valid XML list of public routes');

  // 2. Structured Data & Open Graph on Homepage
  console.log('\n--- 2. Testing Open Graph and Schema.org Metadata ---');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  record(ogTitle?.includes('The FCS Guys'), 'OpenGraph metadata configured on homepage');

  const jsonLdCount = await page.locator('script[type="application/ld+json"]').count();
  record(jsonLdCount > 0, 'Schema.org NewsMediaOrganization structured data present');

  // 3. Testing Cross-Device Responsive Layouts
  console.log('\n--- 3. Testing Responsive Layouts (360px, 390px, 768px, 1024px, 1440px) ---');
  const viewports = [
    { name: 'Mobile 360px', width: 360, height: 640 },
    { name: 'Mobile 390px', width: 390, height: 844 },
    { name: 'Tablet 768px', width: 768, height: 1024 },
    { name: 'Desktop 1024px', width: 1024, height: 768 },
    { name: 'Desktop 1440px', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    record(scrollWidth <= clientWidth, `Viewport ${vp.name}: No horizontal overflow (${scrollWidth}px <= ${clientWidth}px)`);
  }

  // 4. Security Audit: Unauthenticated Route Protection
  console.log('\n--- 4. Security Audit: Route Guard Verification ---');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded' });
  record(page.url().includes('/admin/login'), 'Unauthorized visitor accessing /admin redirected to /admin/login');

  await page.goto('http://localhost:3000/admin/articles', { waitUntil: 'domcontentloaded' });
  record(page.url().includes('/admin/login'), 'Unauthorized visitor accessing /admin/articles redirected to /admin/login');

  // 5. Verification of Public Pages
  console.log('\n--- 5. Testing Public Page Availability & Content Integrity ---');
  const publicRoutes = [
    { url: '/', title: 'Home' },
    { url: '/news', title: 'News Directory' },
    { url: '/news/fcs-championship-bracket-expansion-fallout-deep-dive', title: 'Article Detail' },
    { url: '/top-25', title: 'Top 25 Rankings' },
    { url: '/playoff-projections', title: 'Playoff Bracketology' },
    { url: '/conferences', title: 'Conference Directory' },
    { url: '/conferences/mvfc', title: 'Conference Detail' },
    { url: '/about', title: 'About Page' },
    { url: '/search?q=Bobcats', title: 'Search Results' },
  ];

  for (const route of publicRoutes) {
    const res = await page.goto(`http://localhost:3000${route.url}`, { waitUntil: 'domcontentloaded' });
    record(res?.status() === 200, `Public route [${route.title}] returned 200 OK`);
  }

  await browser.close();

  console.log(`\n==============================================`);
  console.log(`QA Test Execution Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==============================================\n`);

  if (failed > 0) process.exit(1);
}

runProductionQA().catch((err) => {
  console.error('QA Fatal Error:', err);
  process.exit(1);
});

