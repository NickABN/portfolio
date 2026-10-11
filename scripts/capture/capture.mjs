// Takes project screenshots with Playwright. Run it from a machine that can reach the projects:
//   pnpm capture            every enabled shot
//   pnpm capture <slug>...  only the given slugs (works for disabled shots too)
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMAGES_DIR, captureEnvName, frontmatterHint, hideRules, outputPath, validateConfig } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const imagesDir = IMAGES_DIR;

const LOGIN_TIMEOUT_MS = 30_000;

const USAGE = `Usage: pnpm capture [--config <file>] [slug...]

Reads scripts/capture/captures.config.json (or --config <file>) and saves screenshots to ${imagesDir}/.
Without slugs, every shot with "enabled" not set to false is captured.
Logins read CAPTURE_<SLUG>_EMAIL and CAPTURE_<SLUG>_PASSWORD from the environment or a local .env file.
First time on a machine: pnpm exec playwright install chromium`;

function loadEnv() {
  try {
    process.loadEnvFile(path.join(root, '.env'));
  } catch (error) {
    // No .env file is fine: credentials may come from the shell environment.
    if (error?.code === 'ENOENT') return;
    throw new Error(`Cannot load ${path.join(root, '.env')}: ${error.message}`);
  }
}

async function readConfig(configPath) {
  const file = configPath ? path.resolve(configPath) : path.join(here, 'captures.config.json');
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
  await page.click(submitSelector);
  // Wait deterministically for the post-login state: the configured selector, or else a navigation.
  if (waitFor) {
    await page.waitForSelector(waitFor, { timeout: LOGIN_TIMEOUT_MS }).catch(() => {
      throw new Error(`login did not reach "${waitFor}" within ${LOGIN_TIMEOUT_MS / 1000}s (wrong credentials?)`);
    });
  } else {
    await page.waitForURL((next) => next.href !== url, { timeout: LOGIN_TIMEOUT_MS }).catch(() => {
      throw new Error(`login did not leave ${url} within ${LOGIN_TIMEOUT_MS / 1000}s (wrong credentials?). Set login.waitFor for single-page apps`);
    });
  }
  await page.waitForLoadState('networkidle');
}

/** Fails closed: every redaction selector must be valid, otherwise the shot is aborted. */
async function applyHide(page, shot) {
  if (shot.hide.length === 0) return;
  const report = await page.evaluate((selectors) =>
    selectors.map((selector) => {
      try {
        return { selector, matches: document.querySelectorAll(selector).length };
      } catch {
        return { selector, matches: -1 };
      }
    }), shot.hide);
  const invalid = report.filter((entry) => entry.matches < 0).map((entry) => entry.selector);
  if (invalid.length > 0) {
    throw new Error(`invalid "hide" selector(s), nothing captured: ${invalid.map((s) => JSON.stringify(s)).join(', ')}`);
  }
  for (const entry of report.filter((item) => item.matches === 0)) {
    console.warn(`${shot.slug}: warning: hide selector ${JSON.stringify(entry.selector)} matched no elements`);
  }
  await page.addStyleTag({ content: hideRules(shot.hide).join('\n') });
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
    await applyHide(page, shot);
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
  let configPath;
  const flag = args.indexOf('--config');
  if (flag !== -1) {
    configPath = args[flag + 1];
    if (!configPath || configPath.startsWith('-')) throw new Error('--config needs a file path');
    args.splice(flag, 2);
  }
  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE);
    return;
  }
  loadEnv();
  const shots = await readConfig(configPath);
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
        console.log(frontmatterHint(path.posix.basename(relative)));
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
