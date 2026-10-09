import { describe, expect, it } from 'vitest';
import { buildSeo } from './meta';

const base = { siteUrl: 'https://example.com', title: 'T', description: 'D' };

describe('buildSeo', () => {
  it('builds an absolute canonical URL for the default locale', () => {
    expect(buildSeo({ ...base, path: '/', locale: 'en' }).canonical).toBe('https://example.com/');
  });

  it('builds an absolute canonical URL for a prefixed locale', () => {
    expect(buildSeo({ ...base, path: '/es/projects/project-one/', locale: 'es' }).canonical).toBe(
      'https://example.com/es/projects/project-one/',
    );
  });

  it('lists hreflang alternates for every locale plus x-default', () => {
    const { alternates } = buildSeo({ ...base, path: '/es/', locale: 'es' });
    expect(alternates).toEqual([
      { hreflang: 'en', href: 'https://example.com/' },
      { hreflang: 'es', href: 'https://example.com/es/' },
      { hreflang: 'x-default', href: 'https://example.com/' },
    ]);
  });

  it('keeps a single trailing slash when the site URL ends with one', () => {
    const seo = buildSeo({ ...base, siteUrl: 'https://example.com/', path: '/', locale: 'en' });
    expect(seo.canonical).toBe('https://example.com/');
  });

  it('maps locales to Open Graph locales with the others as alternates', () => {
    const seo = buildSeo({ ...base, path: '/', locale: 'en' });
    expect(seo.ogLocale).toBe('en_US');
    expect(seo.ogLocaleAlternates).toEqual(['es_ES']);
  });

  it('passes title, description and URL through to Open Graph', () => {
    const seo = buildSeo({ ...base, path: '/', locale: 'en' });
    expect(seo.title).toBe('T');
    expect(seo.description).toBe('D');
    expect(seo.ogUrl).toBe(seo.canonical);
  });
});
