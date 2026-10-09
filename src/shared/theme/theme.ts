export type Theme = 'light' | 'dark';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/** Light is the default; dark only when the visitor explicitly chose it. */
export function resolveTheme(stored: string | null | undefined): Theme {
  return stored === 'dark' ? 'dark' : 'light';
}
