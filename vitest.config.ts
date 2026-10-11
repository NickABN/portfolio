/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
    // Process motion.css so its tests read the real source (other CSS stays stubbed).
    css: { include: [/motion\.css/] },
  },
});
