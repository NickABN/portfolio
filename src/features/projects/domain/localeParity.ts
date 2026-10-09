import { locales, type Locale } from '../../../shared/i18n/locales';
import { parseEntryId } from './entryId';

export interface LocaleGap {
  slug: string;
  missing: Locale[];
}

/** Lists slugs that are not published in every locale, from content entry ids. */
export function findLocaleGaps(ids: readonly string[]): LocaleGap[] {
  const bySlug = new Map<string, Set<Locale>>();
  for (const id of ids) {
    const parsed = parseEntryId(id);
    if (!parsed) continue;
    const found = bySlug.get(parsed.slug) ?? new Set<Locale>();
    found.add(parsed.locale);
    bySlug.set(parsed.slug, found);
  }
  return [...bySlug.entries()]
    .map(([slug, found]) => ({ slug, missing: locales.filter((locale) => !found.has(locale)) }))
    .filter((gap) => gap.missing.length > 0);
}
