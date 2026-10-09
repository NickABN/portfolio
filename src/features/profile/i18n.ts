import type { Locale } from '../../shared/i18n/locales';

export interface ProfileStrings {
  title: string;
  section: string;
  portraitPlaceholder: string;
  portraitLabel: string;
  quote: string;
  story1: string;
  story2: string;
  skills: { group: string; items: string }[];
}

export const profileUi: Record<Locale, ProfileStrings> = {
  en: {
    title: 'Profile',
    section: 'Section III — The author',
    portraitPlaceholder: '[Your portrait — black and white]',
    portraitLabel: 'Portrait',
    quote: '“[A sentence you believe about building software — the pull quote of your profile.]”',
    story1:
      '[Your story: where you started, the turning points, and the work that shaped how you build things today.]',
    story2: '[Experience in brief: roles, teams, industries — then what you are focused on right now.]',
    skills: [
      { group: 'Frontend', items: '[Your frontend stack]' },
      { group: 'Backend', items: '[Your backend stack]' },
      { group: 'Practice', items: 'Clean architecture, testing, CI/CD' },
    ],
  },
  es: {
    title: 'Perfil',
    section: 'Sección III — El autor',
    portraitPlaceholder: '[Tu retrato — blanco y negro]',
    portraitLabel: 'Retrato',
    quote: '«[Una frase en la que creas sobre construir software — la cita destacada de tu perfil.]»',
    story1:
      '[Tu historia: dónde empezaste, los puntos de inflexión y el trabajo que definió cómo construyes hoy.]',
    story2: '[Experiencia en breve: roles, equipos, industrias — y en qué estás enfocado ahora.]',
    skills: [
      { group: 'Frontend', items: '[Tu stack de frontend]' },
      { group: 'Backend', items: '[Tu stack de backend]' },
      { group: 'Práctica', items: 'Arquitectura limpia, testing, CI/CD' },
    ],
  },
};

export function useProfileUi(locale: Locale): ProfileStrings {
  return profileUi[locale];
}
