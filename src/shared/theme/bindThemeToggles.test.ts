import { describe, expect, it } from 'vitest';
import { bindThemeToggles, type ThemeToggleButton } from './bindThemeToggles';

type FakeButton = ThemeToggleButton & { click(): void; pressed: string | null };

function fakeButton(choice: 'light' | 'dark'): FakeButton {
  let handler: () => void = () => {};
  const button: FakeButton = {
    dataset: { themeChoice: choice },
    pressed: null,
    setAttribute(name: string, value: string) {
      if (name === 'aria-pressed') button.pressed = value;
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

function setup(options: { attr?: string | null; storage?: 'ok' | 'throws' | 'none' } = {}) {
  const attrs: Record<string, string> = options.attr ? { 'data-theme': options.attr } : {};
  const root = {
    getAttribute: (name: string) => attrs[name] ?? null,
    setAttribute: (name: string, value: string) => {
      attrs[name] = value;
    },
  };
  const stored: Record<string, string> = {};
  const storage =
    options.storage === 'none'
      ? null
      : {
          setItem(key: string, value: string) {
            if (options.storage === 'throws') throw new Error('blocked');
            stored[key] = value;
          },
        };
  // Two instances of the control (e.g. masthead plus a second one): [light, dark, light, dark].
  const buttons = [fakeButton('light'), fakeButton('dark'), fakeButton('light'), fakeButton('dark')];
  bindThemeToggles({ root, buttons, storage });
  return { attrs, stored, buttons };
}

const pressed = (buttons: FakeButton[]) => buttons.map((b) => b.pressed);

describe('bindThemeToggles', () => {
  it('marks light as pressed on every instance when nothing is chosen', () => {
    const { buttons } = setup();
    expect(pressed(buttons)).toEqual(['true', 'false', 'true', 'false']);
  });

  it('marks the stored dark choice as pressed on load', () => {
    const { buttons } = setup({ attr: 'dark' });
    expect(pressed(buttons)).toEqual(['false', 'true', 'false', 'true']);
  });

  it('applies and persists the clicked choice and updates all instances', () => {
    const { attrs, stored, buttons } = setup();
    buttons[3]!.click();
    expect(attrs['data-theme']).toBe('dark');
    expect(stored['theme']).toBe('dark');
    expect(pressed(buttons)).toEqual(['false', 'true', 'false', 'true']);

    buttons[0]!.click();
    expect(attrs['data-theme']).toBe('light');
    expect(stored['theme']).toBe('light');
    expect(pressed(buttons)).toEqual(['true', 'false', 'true', 'false']);
  });

  it('still applies the theme when storage throws or is unavailable', () => {
    const blocked = setup({ storage: 'throws' });
    blocked.buttons[1]!.click();
    expect(blocked.attrs['data-theme']).toBe('dark');

    const none = setup({ storage: 'none' });
    none.buttons[1]!.click();
    expect(none.attrs['data-theme']).toBe('dark');
  });

  it('ignores buttons without a valid choice', () => {
    const attrs: Record<string, string> = {};
    const bad = fakeButton('light');
    bad.dataset = { themeChoice: 'sepia' };
    bindThemeToggles({
      root: { getAttribute: (n) => attrs[n] ?? null, setAttribute: (n, v) => void (attrs[n] = v) },
      buttons: [bad],
      storage: null,
    });
    bad.click();
    expect(attrs['data-theme']).toBeUndefined();
  });
});

describe('bindThemeToggles theme color', () => {
  function setupWithColor(attr: string | null) {
    const attrs: Record<string, string> = attr ? { 'data-theme': attr } : {};
    const root = {
      getAttribute: (name: string) => attrs[name] ?? null,
      setAttribute: (name: string, value: string) => {
        attrs[name] = value;
      },
    };
    const colors: string[] = [];
    const buttons = [fakeButton('light'), fakeButton('dark')];
    bindThemeToggles({ root, buttons, storage: null, onThemeChange: (theme) => colors.push(theme) });
    return { buttons, colors };
  }

  it('reports the current theme on load', () => {
    expect(setupWithColor('dark').colors).toEqual(['dark']);
  });

  it('reports every in-session theme switch', () => {
    const { buttons, colors } = setupWithColor(null);
    buttons[1].click();
    buttons[0].click();
    expect(colors).toEqual(['light', 'dark', 'light']);
  });
});
