import type { Locale } from './locales';

export interface UiStrings {
  siteTitle: string;
  siteDescription: string;
  navLabel: string;
  navWork: string;
  navIndex: string;
  navProfile: string;
  navContactShort: string;
  navContact: string;
  navCv: string;
  langLabel: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  edition: string;
  setIn: string;
  printed: string;
  skipToContent: string;
  notFoundTitle: string;
  notFoundText: string;
  notFoundHome: string;
}

export const ui: Record<Locale, UiStrings> = {
  en: {
    siteTitle: 'Portfolio',
    siteDescription: 'Personal portfolio: selected work, profile and contact.',
    navLabel: 'Main',
    navWork: 'Work',
    navIndex: 'Index',
    navProfile: 'Profile',
    navContactShort: 'Contact',
    navContact: 'Correspondence',
    navCv: 'Résumé (PDF)',
    langLabel: 'Language',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    edition: 'Vol. 01 — Edition 2026',
    setIn: 'Set in Newsreader & Archivo Narrow',
    printed: 'Printed with Astro',
    skipToContent: 'Skip to content',
    notFoundTitle: 'Page not found',
    notFoundText: 'The page you are looking for is not in this edition.',
    notFoundHome: 'Back to the front page',
  },
  es: {
    siteTitle: 'Portafolio',
    siteDescription: 'Portafolio personal: trabajo seleccionado, perfil y contacto.',
    navLabel: 'Principal',
    navWork: 'Trabajo',
    navIndex: 'Índice',
    navProfile: 'Perfil',
    navContactShort: 'Contacto',
    navContact: 'Correspondencia',
    navCv: 'CV (PDF)',
    langLabel: 'Idioma',
    themeLabel: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    edition: 'Vol. 01 — Edición 2026',
    setIn: 'Compuesto en Newsreader y Archivo Narrow',
    printed: 'Impreso con Astro',
    skipToContent: 'Saltar al contenido',
    notFoundTitle: 'Página no encontrada',
    notFoundText: 'La página que buscas no está en esta edición.',
    notFoundHome: 'Volver a la portada',
  },
};

export function useUi(locale: Locale): UiStrings {
  return ui[locale];
}
