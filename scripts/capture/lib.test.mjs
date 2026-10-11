import { describe, expect, it } from 'vitest';
import { captureEnvName, frontmatterHint, hideRules, outputPath, validateConfig } from './lib.mjs';

const shot = (extra = {}) => ({
  slug: 'my-app',
  url: 'https://example.com',
  viewport: { width: 1600, height: 1000 },
  ...extra,
});

describe('captureEnvName', () => {
  it('derives an upper-case variable name from the slug', () => {
    expect(captureEnvName('olly-weather', 'email')).toBe('CAPTURE_OLLY_WEATHER_EMAIL');
    expect(captureEnvName('my.app v2', 'password')).toBe('CAPTURE_MY_APP_V2_PASSWORD');
  });
});

describe('outputPath', () => {
  it('names the file after the slug and viewport width', () => {
    expect(outputPath(shot(), 'images')).toBe('images/my-app-1600.png');
  });
  it('honours an explicit output relative to the base directory', () => {
    expect(outputPath(shot({ output: 'custom.png' }), 'images')).toBe('images/custom.png');
  });
  it('rejects outputs that escape the base directory', () => {
    expect(() => outputPath(shot({ output: '../../x.png' }), 'images')).toThrow(/inside/);
  });
});

describe('validateConfig', () => {
  it('returns the shots of a valid config, with defaults applied', () => {
    const [valid] = validateConfig([shot()]);
    expect(valid).toMatchObject({ slug: 'my-app', enabled: true, fullPage: false, hide: [] });
  });
  it('rejects a non-array config', () => {
    expect(() => validateConfig({})).toThrow(/array/);
  });
  it('names the offending shot and field', () => {
    expect(() => validateConfig([shot({ url: 'nope' })])).toThrow(/my-app.*url/);
    expect(() => validateConfig([shot({ viewport: { width: 0, height: 10 } })])).toThrow(/viewport/);
    expect(() => validateConfig([{ ...shot(), slug: 'Bad Slug' }])).toThrow(/slug/);
  });
  it('rejects duplicate slugs', () => {
    expect(() => validateConfig([shot(), shot()])).toThrow(/duplicate/i);
  });
  it('requires every login selector when login is present', () => {
    const login = { url: 'https://example.com/login', emailSelector: '#e', passwordSelector: '#p' };
    expect(() => validateConfig([shot({ login })])).toThrow(/submitSelector/);
  });
  it('rejects non-string hide entries', () => {
    expect(() => validateConfig([shot({ hide: [1] })])).toThrow(/hide/);
  });
});

describe('validateConfig strictness', () => {
  const login = {
    url: 'https://example.com/login',
    emailSelector: '#e',
    passwordSelector: '#p',
    submitSelector: '#s',
  };
  it('rejects non-boolean enabled and fullPage', () => {
    expect(() => validateConfig([shot({ enabled: 'false' })])).toThrow(/enabled/);
    expect(() => validateConfig([shot({ fullPage: 1 })])).toThrow(/fullPage/);
    expect(validateConfig([shot({ enabled: false, fullPage: true })])[0]).toMatchObject({ enabled: false, fullPage: true });
  });
  it('rejects negative or non-integer delayMs', () => {
    expect(() => validateConfig([shot({ delayMs: -1 })])).toThrow(/delayMs/);
    expect(() => validateConfig([shot({ delayMs: 1.5 })])).toThrow(/delayMs/);
  });
  it('rejects non-string waitFor and output', () => {
    expect(() => validateConfig([shot({ waitFor: 3 })])).toThrow(/waitFor/);
    expect(() => validateConfig([shot({ output: 3 })])).toThrow(/output/);
  });
  it('rejects a non-object login and a non-http(s) login url', () => {
    expect(() => validateConfig([shot({ login: 'x' })])).toThrow(/login/);
    expect(() => validateConfig([shot({ login: { ...login, url: 'file:///etc/passwd' } })])).toThrow(/login\.url/);
  });
  it('rejects a non-string login.waitFor', () => {
    expect(() => validateConfig([shot({ login: { ...login, waitFor: 1 } })])).toThrow(/login\.waitFor/);
    expect(validateConfig([shot({ login: { ...login, waitFor: 'main' } })])).toHaveLength(1);
  });
  it('rejects a bad output extension at startup', () => {
    expect(() => validateConfig([shot({ output: 'shot.gif' })])).toThrow(/\.png/);
    expect(validateConfig([shot({ output: 'shot.JPG' })])).toHaveLength(1);
  });
  it('rejects an output escaping the images folder at startup', () => {
    expect(() => validateConfig([shot({ output: '../../x.png' })])).toThrow(/inside/);
  });
});

describe('hideRules', () => {
  it('builds one rule per selector so one bad selector cannot void the rest', () => {
    expect(hideRules(['.a', '[data-x]'])).toEqual([
      '.a { visibility: hidden !important; }',
      '[data-x] { visibility: hidden !important; }',
    ]);
    expect(hideRules([])).toEqual([]);
  });
});

describe('frontmatterHint', () => {
  it('prints the frontmatter lines to paste', () => {
    expect(frontmatterHint('my-app-1600.png')).toBe(
      'cover: ../images/my-app-1600.png\ncoverAlt: "Describe what the screenshot shows"',
    );
  });
});
