// Takes project screenshots with Playwright. Run it from a machine that can reach the projects:
//   pnpm capture            every enabled shot
//   pnpm capture <slug>...  only the given slugs (works for disabled shots too)
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { captureEnvName, frontmatterHint, outputPath, validateConfig } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const imagesDir = 'src/features/projects/content/images';

const USAGE = `Usage: pnpm capture [slug...]

Reads scripts/capture/captures.config.json and saves screenshots to ${imagesDir}/.
Without slugs, every shot with "enabled" not set to false is captured.
Logins read CAPTURE_<SLUG>_EMAIL and CAPTURE_<SLUG>_PASSWORD from the environment or a local .env file.
First time on a machine: pnpm exec playwright install chromium`;

function loadEnv() {
  try {
    process.loadEnvFile(path.join(root, '.env'));
  } catch {
    // No .env file: credentials may come from the shell environment.
  }
}

async function readConfig() {
  const file = path.join(here, 'captures.config.json');
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch {
    throw new Error(`Cannot read ${file}`);
  }
  try {
    return validateConfig(JSON.parse(text));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`captures.config.json is not valid JSON: ${error.message}`);
    throw error;
  }
}

async function login(page, shot) {
  const emailVar = captureEnvName(shot.slug, 'email');
  const passwordVar = captureEnvName(shot.slug, 'password');
  const email = process.env[emailVar];
  const password = process.env[passwordVar];
  if (!email || !password) {
    throw new Error(`"${shot.slug}" needs a login: set ${emailVar} and ${passwordVar} (in .env or the shell)`);
  }
  const { url, emailSelector, passwordSelector, submitSelector, waitFor } = shot.login;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.fill(emailSelector, email);
  await page.fill(passwordSelector, password);
  await Promise.all([page.waitForLoadState('networkidle'), page.click(submitSelector)]);
  if (waitFor) await page.waitForSelector(waitFor);
}

async function capture(browser, shot) {
  const context = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    if (shot.login) await login(page, shot);
    await page.goto(shot.url, { waitUntil: 'networkidle' });
    if (shot.waitFor) await page.waitForSelector(shot.waitFor);
    if (shot.hide.length > 0) {
      await page.addStyleTag({ content: `${shot.hide.join(', ')} { visibility: hidden !important; }` });
    }
    if (shot.delayMs) await page.waitForTimeout(shot.delayMs);
    const relative = outputPath(shot, imagesDir);
    const target = path.join(root, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await page.screenshot({ path: target, fullPage: shot.fullPage });
    return relative;
  } finally {
    await context.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE);
    return;
  }
  loadEnv();
  const shots = await readConfig();
  const known = new Set(shots.map((shot) => shot.slug));
  const unknown = args.filter((slug) => !known.has(slug));
  if (unknown.length > 0) {
    throw new Error(`Unknown slug(s): ${unknown.join(', ')}. Known: ${[...known].join(', ') || '(none)'}`);
  }
  const selected = args.length > 0 ? shots.filter((shot) => args.includes(shot.slug)) : shots.filter((shot) => shot.enabled);
  if (selected.length === 0) {
    console.log('Nothing to capture: every shot is disabled. Set "enabled": true or pass a slug.');
    return;
  }

  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    throw new Error('Playwright is not installed. Run: pnpm install');
  }
  let browser;
  try {
    browser = await playwright.chromium.launch();
  } catch {
    throw new Error('Chromium is not available. Run once on this machine: pnpm exec playwright install chromium');
  }

  let failed = 0;
  try {
    for (const shot of selected) {
      try {
        const relative = await capture(browser, shot);
        console.log(`\n${shot.slug}: saved ${relative}`);
        console.log('Paste into src/features/projects/content/{en,es}/' + shot.slug + '.md:');
        console.log(frontmatterHint(shot.slug, path.posix.basename(relative)));
      } catch (error) {
        failed += 1;
        console.error(`\n${shot.slug}: failed: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
  }
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
