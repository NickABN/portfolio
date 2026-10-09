import { isLocale, type Locale } from '../../../shared/i18n/locales';

/**
 * Content entries live in `<locale>/<slug>.md`; the collection id is `<locale>/<slug>`.
 * Slugs are single-segment because the routes are `[slug]`.
 */
export function parseEntryId(id: string): { locale: Locale; slug: string } | null {
  const separator = id.indexOf('/');
  if (separator < 1) return null;
  const locale = id.slice(0, separator);
  const slug = id.slice(separator + 1);
  if (!isLocale(locale) || slug === '' || slug.includes('/')) return null;
  return { locale, slug };
}
