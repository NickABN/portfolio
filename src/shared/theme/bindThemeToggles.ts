import { isTheme, resolveTheme, type Theme } from './theme';

export interface ThemeToggleButton {
  /** `themeChoice` is the theme this button selects ("light" or "dark"). */
  dataset: { themeChoice?: string };
  setAttribute(name: string, value: string): void;
  addEventListener(type: 'click', listener: () => void): void;
}

export interface ThemeToggleDeps {
  root: { getAttribute(name: string): string | null; setAttribute(name: string, value: string): void };
  buttons: Iterable<ThemeToggleButton>;
  storage: { setItem(key: string, value: string): void } | null;
  /** Called with the active theme on load and after every switch (e.g. to update the theme-color meta). */
  onThemeChange?: (theme: Theme) => void;
}

/** Wires every segmented theme button: a click selects and persists its theme, aria-pressed tracks the state. */
export function bindThemeToggles({ root, buttons, storage, onThemeChange }: ThemeToggleDeps): void {
  const list = [...buttons];

  const syncPressed = (): void => {
    const theme = resolveTheme(root.getAttribute('data-theme'));
    for (const button of list) {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    }
    onThemeChange?.(theme);
  };

  for (const button of list) {
    button.addEventListener('click', () => {
      const choice = button.dataset.themeChoice;
      if (!isTheme(choice)) return;
      root.setAttribute('data-theme', choice);
      try {
        storage?.setItem('theme', choice);
      } catch {
        // Storage unavailable: the choice applies for this visit only.
      }
      syncPressed();
    });
  }

  syncPressed();
}
