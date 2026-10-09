import type { Locale } from './locales';

export interface UiStrings {
  siteTitle: string;
  siteDescription: string;
  navLabel: string;
  navWork: string;
  navProfile: string;
  navContact: string;
  navCv: string;
  langLabel: string;
  themeToggleToDark: string;
  themeToggleToLight: string;
  edition: string;
  setIn: string;
  printed: string;
  skipToContent: string;
}

export const ui: Record<Locale, UiStrings> = {
  en: {
    siteTitle: 'Portfolio',
    siteDescription: 'Personal portfolio: selected work, profile and contact.',
    navLabel: 'Main',
    navWork: 'Work',
    navProfile: 'Profile',
    navContact: 'Correspondence',
    navCv: 'Résumé (PDF)',
    langLabel: 'Language',
    themeToggleToDark: 'Switch to dark theme',
    themeToggleToLight: 'Switch to light theme',
    edition: 'Vol. 01 — Edition 2026',
    setIn: 'Set in Newsreader & Archivo Narrow',
    printed: 'Printed with Astro',
    skipToContent: 'Skip to content',
  },
  es: {
    siteTitle: 'Portafolio',
    siteDescription: 'Portafolio personal: trabajo seleccionado, perfil y contacto.',
    navLabel: 'Principal',
    navWork: 'Trabajo',
    navProfile: 'Perfil',
    navContact: 'Correspondencia',
    navCv: 'CV (PDF)',
    langLabel: 'Idioma',
    themeToggleToDark: 'Cambiar a tema oscuro',
    themeToggleToLight: 'Cambiar a tema claro',
    edition: 'Vol. 01 — Edición 2026',
    setIn: 'Compuesto en Newsreader y Archivo Narrow',
    printed: 'Impreso con Astro',
    skipToContent: 'Saltar al contenido',
  },
};

export function useUi(locale: Locale): UiStrings {
  return ui[locale];
}
