import { defineConfig } from 'astro/config';
import { defaultLocale, locales } from './src/shared/i18n/locales';

export default defineConfig({
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },
});
