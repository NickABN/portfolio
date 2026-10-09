import { defaultLocale, isLocale, locales, type Locale } from './locales';

function firstSegment(path: string): string {
  return path.split(/[/?#]/).filter(Boolean)[0] ?? '';
}

/** Guarantees exactly one leading slash, collapsing any repeated ones. */
function ensureLeadingSlash(path: string): string {
  return `/${path.replace(/^\/+/, '')}`;
}

export function getLocaleFromPath(path: string): Locale {
  const segment = firstSegment(path);
  return isLocale(segment) ? segment : defaultLocale;
}

/** Removes a leading locale segment: `/es/a/` becomes `/a/`, `/es` becomes `/`. */
export function stripLocale(path: string): string {
  const normalized = ensureLeadingSlash(path);
  const segment = firstSegment(normalized);
  if (!isLocale(segment)) return normalized;
  const rest = normalized.slice(segment.length + 1);
  if (rest === '') return '/';
  return rest.startsWith('/') ? rest : `/${rest}`;
}

/** Builds the URL path of a page for a locale. The default locale is unprefixed. */
export function localizePath(path: string, locale: Locale): string {
  const bare = stripLocale(path);
  return locale === defaultLocale ? bare : `/${locale}${bare}`;
}

export function switchLocalePath(path: string, locale: Locale): string {
  return localizePath(path, locale);
}

export function getAlternatePaths(path: string): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, localizePath(path, locale)]),
  ) as Record<Locale, string>;
}
