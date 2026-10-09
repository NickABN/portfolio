import { nextTheme, resolveTheme, toggleLabel, type Theme } from './theme';

export interface ThemeToggleButton {
  dataset: { labelToDark?: string; labelToLight?: string };
  setAttribute(name: string, value: string): void;
  addEventListener(type: 'click', listener: () => void): void;
}

export interface ThemeToggleDeps {
  root: { getAttribute(name: string): string | null; setAttribute(name: string, value: string): void };
  buttons: Iterable<ThemeToggleButton>;
  storage: { setItem(key: string, value: string): void } | null;
  colorScheme: { matches: boolean; addEventListener(type: 'change', listener: () => void): void };
}

/** Wires every theme toggle: click flips and persists the theme, labels track the state. */
export function bindThemeToggles({ root, buttons, storage, colorScheme }: ThemeToggleDeps): void {
  const list = [...buttons];

  const currentTheme = (): Theme => resolveTheme(root.getAttribute('data-theme'), colorScheme.matches);

  const syncLabels = (): void => {
    const theme = currentTheme();
    for (const button of list) {
      const { labelToDark, labelToLight } = button.dataset;
      if (!labelToDark || !labelToLight) continue;
      button.setAttribute('aria-label', toggleLabel(theme, { toDark: labelToDark, toLight: labelToLight }));
    }
  };

  for (const button of list) {
    button.addEventListener('click', () => {
      const next = nextTheme(currentTheme());
      root.setAttribute('data-theme', next);
      try {
        storage?.setItem('theme', next);
      } catch {
        // Storage unavailable: the choice applies for this visit only.
      }
      syncLabels();
    });
  }

  // Without an explicit choice the theme follows the system, so keep labels in step.
  colorScheme.addEventListener('change', syncLabels);
  syncLabels();
}
