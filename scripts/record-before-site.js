/**
 * Record desktop walkthrough of the live koolenergytechnology.com site (before).
 * Output: transformation/before-*.webm + mp4, plus full-page PNGs.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT = path.resolve(__dirname, '..', 'transformation');
const VIEWPORT = { width: 1440, height: 900 };
const BASE = 'https://koolenergytechnology.com';
const PAGES = [
  { slug: 'home', url: `${BASE}/home` },
  { slug: 'about', url: `${BASE}/about` },
  { slug: 'gallery', url: `${BASE}/gallery` },
  { slug: 'services', url: `${BASE}/services` },
  { slug: 'financing', url: `${BASE}/financing` },
  { slug: 'contact', url: `${BASE}/contact` },
  { slug: 'service-request', url: `${BASE}/service-request` },
];

async function dismissCookies(page) {
  for (const label of ['Accept', 'Accept All', 'I Agree', 'Got it']) {
    const btn = page.getByRole('button', { name: label });
    if (await btn.count()) {
      try {
        await btn.first().click({ timeout: 2000 });
        await page.waitForTimeout(400);
        return;
      } catch {}
    }
    const link = page.getByRole('link', { name: label });
    if (await link.count()) {
      try {
        await link.first().click({ timeout: 2000 });
        await page.waitForTimeout(400);
        return;
      } catch {}
    }
  }
}

async function smoothScroll(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const max = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const step = Math.max(40, Math.floor(window.innerHeight * 0.35));
    for (let y = 0; y < max; y += step) {
      window.scrollTo({ top: y, behavior: 'smooth' });
      await delay(450);
    }
    window.scrollTo({ top: max, behavior: 'smooth' });
    await delay(700);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await delay(600);
  });
}

async function recordPage(browser, { slug, url }) {
  const videoDir = path.join(OUT, '_tmp', slug);
  fs.mkdirSync(videoDir, { recursive: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: VIEWPORT },
  });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  await dismissCookies(page);
  await page.waitForTimeout(800);

  const shotPath = path.join(OUT, `before-${slug}-desktop.png`);
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('screenshot', shotPath);

  await page.waitForTimeout(500);
  await smoothScroll(page);
  await page.waitForTimeout(800);

  await context.close();

  const webm = fs.readdirSync(videoDir).find((f) => f.endsWith('.webm'));
  if (!webm) throw new Error(`No webm for ${slug}`);
  const destWebm = path.join(OUT, `before-${slug}-desktop.webm`);
  fs.renameSync(path.join(videoDir, webm), destWebm);
  fs.rmSync(videoDir, { recursive: true, force: true });

  const destMp4 = path.join(OUT, `before-${slug}-desktop.mp4`);
  try {
    execFileSync(
      'ffmpeg',
      ['-y', '-i', destWebm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', destMp4],
      { stdio: 'ignore' }
    );
    console.log('video', destMp4);
  } catch (e) {
    console.warn('ffmpeg failed for', slug, '- keeping webm only');
    console.log('video', destWebm);
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const p of PAGES) {
      console.log('recording', p.url);
      await recordPage(browser, p);
    }
  } finally {
    await browser.close();
    const tmp = path.join(OUT, '_tmp');
    if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log('done →', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
