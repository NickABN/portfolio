export type Theme = 'light' | 'dark';

export interface ToggleLabels {
  toDark: string;
  toLight: string;
}

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/** An explicit stored choice wins; otherwise the system preference decides. */
export function resolveTheme(stored: string | null | undefined, systemPrefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return systemPrefersDark ? 'dark' : 'light';
}

export function nextTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

/** Label for the action a click performs from the current theme. */
export function toggleLabel(current: Theme, labels: ToggleLabels): string {
  return current === 'dark' ? labels.toLight : labels.toDark;
}
