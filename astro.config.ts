import { defineConfig } from 'astro/config';
import { site as siteConfig } from './src/shared/config/site';
import { defaultLocale, locales } from './src/shared/i18n/locales';

export default defineConfig({
  site: siteConfig.url,
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },
});
