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

  it('rejects nested slugs because routes are single-segment', () => {
    expect(parseEntryId('en/a/b')).toBeNull();
    expect(parseEntryId('en/a/')).toBeNull();
  });
});
