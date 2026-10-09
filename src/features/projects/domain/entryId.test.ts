import { describe, expect, it } from 'vitest';
import { parseEntryId } from './entryId';

describe('parseEntryId', () => {
  it('splits a locale folder from the slug', () => {
    expect(parseEntryId('en/project-one')).toEqual({ locale: 'en', slug: 'project-one' });
    expect(parseEntryId('es/project-one')).toEqual({ locale: 'es', slug: 'project-one' });
  });

  it('returns null when the folder is not a known locale or the slug is missing', () => {
    expect(parseEntryId('fr/project-one')).toBeNull();
    expect(parseEntryId('project-one')).toBeNull();
    expect(parseEntryId('en/')).toBeNull();
  });

  it('keeps nested segments inside the slug', () => {
    expect(parseEntryId('en/a/b')).toEqual({ locale: 'en', slug: 'a/b' });
  });
});
