import { describe, expect, it } from 'vitest';
import {
  getAlternatePaths,
  getLocaleFromPath,
  localizePath,
  stripLocale,
  switchLocalePath,
} from './utils';

describe('getLocaleFromPath', () => {
  it('returns the default locale for unprefixed paths', () => {
    expect(getLocaleFromPath('/')).toBe('en');
    expect(getLocaleFromPath('/projects/alpha/')).toBe('en');
  });

  it('detects the Spanish prefix', () => {
    expect(getLocaleFromPath('/es')).toBe('es');
    expect(getLocaleFromPath('/es/')).toBe('es');
    expect(getLocaleFromPath('/es/projects/alpha/')).toBe('es');
  });

  it('does not confuse paths that merely start with the locale letters', () => {
    expect(getLocaleFromPath('/espresso/')).toBe('en');
  });
});

describe('stripLocale', () => {
  it('removes the locale prefix and keeps the rest', () => {
    expect(stripLocale('/es/')).toBe('/');
    expect(stripLocale('/es')).toBe('/');
    expect(stripLocale('/es/projects/alpha/')).toBe('/projects/alpha/');
    expect(stripLocale('/projects/alpha/')).toBe('/projects/alpha/');
  });
});

describe('localizePath', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localizePath('/', 'en')).toBe('/');
    expect(localizePath('/projects/alpha/', 'en')).toBe('/projects/alpha/');
  });

  it('prefixes non-default locales', () => {
    expect(localizePath('/', 'es')).toBe('/es/');
    expect(localizePath('/projects/alpha/', 'es')).toBe('/es/projects/alpha/');
  });

  it('accepts paths without a leading slash', () => {
    expect(localizePath('projects/alpha/', 'es')).toBe('/es/projects/alpha/');
  });

  it('does not double-prefix an already localized path', () => {
    expect(localizePath('/es/projects/alpha/', 'es')).toBe('/es/projects/alpha/');
  });
});

describe('switchLocalePath', () => {
  it('keeps the current page when switching language', () => {
    expect(switchLocalePath('/projects/alpha/', 'es')).toBe('/es/projects/alpha/');
    expect(switchLocalePath('/es/projects/alpha/', 'en')).toBe('/projects/alpha/');
    expect(switchLocalePath('/es/', 'en')).toBe('/');
  });
});

describe('getAlternatePaths', () => {
  it('returns the path of the same page in every locale', () => {
    expect(getAlternatePaths('/es/projects/alpha/')).toEqual({
      en: '/projects/alpha/',
      es: '/es/projects/alpha/',
    });
  });
});
