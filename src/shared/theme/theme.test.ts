import { describe, expect, it } from 'vitest';
import { nextTheme, resolveTheme, toggleLabel } from './theme';

describe('resolveTheme', () => {
  it('honours an explicit stored choice over the system preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('follows the system preference when nothing valid is stored', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
    expect(resolveTheme('sepia', true)).toBe('dark');
    expect(resolveTheme(undefined, false)).toBe('light');
  });
});

describe('nextTheme', () => {
  it('flips between light and dark', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });
});

describe('toggleLabel', () => {
  const labels = { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' };

  it('describes the action that the next click performs', () => {
    expect(toggleLabel('light', labels)).toBe('Switch to dark theme');
    expect(toggleLabel('dark', labels)).toBe('Switch to light theme');
  });
});
