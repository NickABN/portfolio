import { describe, expect, it } from 'vitest';
import { bindThemeToggles, type ThemeToggleButton } from './bindThemeToggles';

function fakeButton(): ThemeToggleButton & { click(): void; label: string | null } {
  let handler: () => void = () => {};
  const button = {
    dataset: { labelToDark: 'to dark', labelToLight: 'to light' } as ThemeToggleButton['dataset'],
    label: null as string | null,
    setAttribute(name: string, value: string) {
      if (name === 'aria-label') button.label = value;
    },
    addEventListener(_type: 'click', listener: () => void) {
      handler = listener;
    },
    click() {
      handler();
    },
  };
  return button;
}

function setup(options: { attr?: string | null; dark?: boolean; storage?: 'ok' | 'throws' } = {}) {
  const attrs: Record<string, string> = options.attr ? { 'data-theme': options.attr } : {};
  const root = {
    getAttribute: (name: string) => attrs[name] ?? null,
    setAttribute: (name: string, value: string) => {
      attrs[name] = value;
    },
  };
  const stored: Record<string, string> = {};
  const storage = {
    setItem(key: string, value: string) {
      if (options.storage === 'throws') throw new Error('blocked');
      stored[key] = value;
    },
  };
  let onChange: () => void = () => {};
  const colorScheme = {
    matches: options.dark ?? false,
    addEventListener(_type: 'change', listener: () => void) {
      onChange = listener;
    },
  };
  const buttons = [fakeButton(), fakeButton()];
  bindThemeToggles({ root, buttons, storage, colorScheme });
  return { attrs, stored, buttons, colorScheme, fire: () => onChange() };
}

describe('bindThemeToggles', () => {
  it('labels every button with the action available from the current theme', () => {
    const { buttons } = setup({ dark: true });
    expect(buttons.map((b) => b.label)).toEqual(['to light', 'to light']);
  });

  it('flips the theme on click, persists it and relabels all buttons', () => {
    const { attrs, stored, buttons } = setup({ attr: 'light' });
    buttons[1]!.click();
    expect(attrs['data-theme']).toBe('dark');
    expect(stored['theme']).toBe('dark');
    expect(buttons.map((b) => b.label)).toEqual(['to light', 'to light']);
  });

  it('still applies the theme when storage throws', () => {
    const { attrs, buttons } = setup({ attr: 'dark', storage: 'throws' });
    buttons[0]!.click();
    expect(attrs['data-theme']).toBe('light');
  });

  it('relabels when the system preference changes without an explicit choice', () => {
    const { colorScheme, buttons, fire } = setup({ dark: false });
    expect(buttons[0]!.label).toBe('to dark');
    colorScheme.matches = true;
    fire();
    expect(buttons[0]!.label).toBe('to light');
  });
});
