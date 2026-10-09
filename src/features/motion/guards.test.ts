import { describe, expect, it } from 'vitest';
import { resolveHashTarget, shouldEnableSmoothScroll } from './guards';

describe('shouldEnableSmoothScroll', () => {
  it('enables smooth scroll for a fine pointer without reduced motion', () => {
    expect(shouldEnableSmoothScroll({ prefersReducedMotion: false, coarsePointer: false })).toBe(true);
  });

  it('keeps native scroll when the user prefers reduced motion', () => {
    expect(shouldEnableSmoothScroll({ prefersReducedMotion: true, coarsePointer: false })).toBe(false);
  });

  it('keeps native scroll on touch devices', () => {
    expect(shouldEnableSmoothScroll({ prefersReducedMotion: false, coarsePointer: true })).toBe(false);
  });

  it('treats a missing coarsePointer as a fine pointer', () => {
    expect(shouldEnableSmoothScroll({ prefersReducedMotion: false })).toBe(true);
  });
});

describe('resolveHashTarget', () => {
  it('resolves a bare hash', () => {
    expect(resolveHashTarget('#work', '/')).toBe('work');
  });

  it('resolves a hash on the current path', () => {
    expect(resolveHashTarget('/es/#profile', '/es/')).toBe('profile');
  });

  it('ignores a trailing-slash difference on the current path', () => {
    expect(resolveHashTarget('/es#profile', '/es/')).toBe('profile');
  });

  it('returns null for a hash on another page', () => {
    expect(resolveHashTarget('/#work', '/projects/project-one/')).toBeNull();
    expect(resolveHashTarget('/es/#work', '/')).toBeNull();
  });

  it('returns null for external URLs', () => {
    expect(resolveHashTarget('https://example.com/#work', '/')).toBeNull();
  });

  it('returns null without a fragment or with an empty one', () => {
    expect(resolveHashTarget('/', '/')).toBeNull();
    expect(resolveHashTarget('#', '/')).toBeNull();
  });

  it('decodes percent-encoded ids', () => {
    expect(resolveHashTarget('#caf%C3%A9', '/')).toBe('café');
  });

  it('returns null for malformed encodings', () => {
    expect(resolveHashTarget('#%E0%A4%A', '/')).toBeNull();
  });
});
