import { describe, expect, it } from 'vitest';
import { findLocaleGaps } from './localeParity';

describe('findLocaleGaps', () => {
  it('reports nothing when every slug exists in every locale', () => {
    expect(findLocaleGaps(['en/a', 'es/a', 'en/b', 'es/b'])).toEqual([]);
  });

  it('reports the locales that miss a slug', () => {
    expect(findLocaleGaps(['en/a', 'es/a', 'en/b'])).toEqual([{ slug: 'b', missing: ['es'] }]);
    expect(findLocaleGaps(['es/only-es'])).toEqual([{ slug: 'only-es', missing: ['en'] }]);
  });

  it('ignores ids that do not parse', () => {
    expect(findLocaleGaps(['fr/a', 'a', 'en/a/b'])).toEqual([]);
  });
});

describe('project content', () => {
  it('has every slug in every locale', () => {
    // Keys only: the modules are never imported, so no Markdown pipeline runs.
    const files = Object.keys(import.meta.glob('../content/*/*.md'));
    const ids = files.map((file) => file.replace(/^.*\/content\//, '').replace(/\.md$/, ''));
    expect(ids.length).toBeGreaterThan(0);
    expect(findLocaleGaps(ids)).toEqual([]);
  });
});
