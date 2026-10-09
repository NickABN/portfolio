import type { Locale } from '../../shared/i18n/locales';

export interface HeroStrings {
  role: string;
  tags: string[];
  frontKicker: string;
  /** Headline in three segments; the last one is set in the display accent. */
  headline: [string, string, string];
  deck: string;
  intro1: string;
  intro2: string;
  fig: string;
  fig1: string;
  homeLink: string;
}

export const heroUi: Record<Locale, HeroStrings> = {
  en: {
    role: 'Software Engineer',
    tags: ['Architecture', 'Interfaces', 'Systems'],
    frontKicker: 'Front page',
    headline: ['Software, written', 'with the care of ', 'good prose.'],
    deck: '[Deck: one or two sentences on who you are and the kind of work you do best.]',
    intro1:
      '[Opening paragraph in your own voice: how you approach a problem, the systems you like to build and what you care about when you write code.]',
    intro2:
      '[Second paragraph: current focus, what you are learning, and the kind of team or project you would like to join next.]',
    fig: 'Fig.',
    fig1: 'Wireframe study. Rotates on its own axis and follows the reader’s cursor.',
    homeLink: 'Back to the front page',
  },
  es: {
    role: 'Ingeniero de Software',
    tags: ['Arquitectura', 'Interfaces', 'Sistemas'],
    frontKicker: 'Portada',
    headline: ['Software escrito', 'con el cuidado de ', 'la buena prosa.'],
    deck: '[Copete: una o dos oraciones sobre quién eres y el tipo de trabajo que mejor haces.]',
    intro1:
      '[Párrafo de apertura con tu propia voz: cómo abordas un problema, qué sistemas te gusta construir y qué te importa al escribir código.]',
    intro2:
      '[Segundo párrafo: tu enfoque actual, qué estás aprendiendo y en qué tipo de equipo o proyecto te gustaría trabajar.]',
    fig: 'Fig.',
    fig1: 'Estudio en alambre. Gira sobre su propio eje y sigue el cursor del lector.',
    homeLink: 'Volver a la portada',
  },
};

export function useHeroUi(locale: Locale): HeroStrings {
  return heroUi[locale];
}
