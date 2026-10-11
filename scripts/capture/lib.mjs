// Pure helpers for the capture script: no browser, no filesystem, easy to test.
import path from 'node:path';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOGIN_FIELDS = ['url', 'emailSelector', 'passwordSelector', 'submitSelector'];

/** `captureEnvName('olly-weather', 'email')` -> `CAPTURE_OLLY_WEATHER_EMAIL`. */
export function captureEnvName(slug, field) {
  const clean = (value) => value.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
  return `CAPTURE_${clean(slug)}_${clean(field)}`;
}

/** Output file for a shot, always inside `baseDir` and always with forward slashes. */
export function outputPath(shot, baseDir) {
  const name = shot.output ?? `${shot.slug}-${shot.viewport.width}.png`;
  const slashes = (value) => value.replaceAll('\\', '/');
  const base = path.posix.normalize(slashes(baseDir));
  const full = path.posix.normalize(path.posix.join(base, slashes(name)));
  if (!full.startsWith(`${base}/`)) {
    throw new Error(`output "${name}" must stay inside ${baseDir}`);
  }
  return full;
}

/** Frontmatter lines the owner pastes into the project's Markdown files. */
export function frontmatterHint(_slug, fileName) {
  return `cover: ../images/${fileName}\ncoverAlt: "Describe what the screenshot shows"`;
}

function fail(label, message) {
  throw new Error(`captures.config.json: ${label}: ${message}`);
}

function isHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function validateLogin(login, label) {
  if (typeof login !== 'object' || login === null) fail(label, '"login" must be an object');
  for (const field of LOGIN_FIELDS) {
    if (typeof login[field] !== 'string' || login[field] === '') {
      fail(label, `"login.${field}" is required`);
    }
  }
  if (!isHttpUrl(login.url)) fail(label, '"login.url" must be an http(s) URL');
}

/** Validates the config and returns the shots with defaults applied. Throws a readable error. */
export function validateConfig(config) {
  if (!Array.isArray(config)) {
    throw new Error('captures.config.json: expected an array of shots');
  }
  const seen = new Set();
  return config.map((raw, index) => {
    const label = typeof raw?.slug === 'string' ? `shot "${raw.slug}"` : `shot #${index + 1}`;
    if (typeof raw !== 'object' || raw === null) fail(label, 'must be an object');
    if (typeof raw.slug !== 'string' || !SLUG.test(raw.slug)) {
      fail(label, '"slug" must be lower-case letters, digits and hyphens');
    }
    if (seen.has(raw.slug)) fail(label, `duplicate slug "${raw.slug}"`);
    seen.add(raw.slug);
    if (typeof raw.url !== 'string' || !isHttpUrl(raw.url)) fail(label, '"url" must be an http(s) URL');
    const { width, height } = raw.viewport ?? {};
    if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      fail(label, '"viewport" needs positive integer width and height');
    }
    if (raw.hide !== undefined && (!Array.isArray(raw.hide) || raw.hide.some((s) => typeof s !== 'string'))) {
      fail(label, '"hide" must be an array of CSS selectors');
    }
    for (const field of ['waitFor', 'output']) {
      if (raw[field] !== undefined && typeof raw[field] !== 'string') fail(label, `"${field}" must be a string`);
    }
    if (raw.delayMs !== undefined && (!Number.isInteger(raw.delayMs) || raw.delayMs < 0)) {
      fail(label, '"delayMs" must be a non-negative integer');
    }
    if (raw.login !== undefined) validateLogin(raw.login, label);
    return {
      ...raw,
      enabled: raw.enabled ?? true,
      fullPage: raw.fullPage ?? false,
      hide: raw.hide ?? [],
    };
  });
}
