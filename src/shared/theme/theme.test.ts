import { describe, expect, it } from 'vitest';
import { resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('is dark only when the stored choice is dark', () => {
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('defaults to light when nothing is stored', () => {
    expect(resolveTheme(null)).toBe('light');
    expect(resolveTheme(undefined)).toBe('light');
  });

  it('keeps an explicit light choice and ignores invalid values', () => {
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('sepia')).toBe('light');
    expect(resolveTheme('')).toBe('light');
  });
});
