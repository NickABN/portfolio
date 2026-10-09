import { defaultLocale, locales, type Locale } from '../i18n/locales';
import { getAlternatePaths, localizePath } from '../i18n/utils';

const OG_LOCALES: Record<Locale, string> = { en: 'en_US', es: 'es_ES' };

export interface SeoInput {
  /** Absolute site origin, e.g. `https://example.com`. */
  siteUrl: string;
  /** Path of the current page, with or without a locale prefix. */
  path: string;
  locale: Locale;
  title: string;
  description: string;
}

export interface AlternateLink {
  hreflang: string;
  href: string;
}

export interface Seo {
  title: string;
  description: string;
  canonical: string;
  alternates: AlternateLink[];
  ogUrl: string;
  ogLocale: string;
  ogLocaleAlternates: string[];
}

function absolute(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/+$/, '')}${path}`;
}

/** Derives canonical, hreflang and Open Graph values for a page. */
export function buildSeo({ siteUrl, path, locale, title, description }: SeoInput): Seo {
  const paths = getAlternatePaths(path);
  const canonical = absolute(siteUrl, localizePath(path, locale));
  const alternates: AlternateLink[] = [
    ...locales.map((code) => ({ hreflang: code, href: absolute(siteUrl, paths[code]) })),
    { hreflang: 'x-default', href: absolute(siteUrl, paths[defaultLocale]) },
  ];

  return {
    title,
    description,
    canonical,
    alternates,
    ogUrl: canonical,
    ogLocale: OG_LOCALES[locale],
    ogLocaleAlternates: locales.filter((code) => code !== locale).map((code) => OG_LOCALES[code]),
  };
}
