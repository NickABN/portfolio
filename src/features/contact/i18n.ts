import type { Locale } from '../../shared/i18n/locales';

export interface ContactStrings {
  kicker: string;
  headlineFirst: string;
  headlineEmphasis: string;
  linkedin: string;
  github: string;
  cv: string;
  opensInNewTab: string;
}

export const contactUi: Record<Locale, ContactStrings> = {
  en: {
    kicker: 'Correspondence',
    headlineFirst: 'Letters are',
    headlineEmphasis: 'always welcome.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    cv: 'Résumé — PDF',
    opensInNewTab: '(opens in a new tab)',
  },
  es: {
    kicker: 'Correspondencia',
    headlineFirst: 'Las cartas son',
    headlineEmphasis: 'siempre bienvenidas.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    cv: 'CV — PDF',
    opensInNewTab: '(se abre en una pestaña nueva)',
  },
};

export function useContactUi(locale: Locale): ContactStrings {
  return contactUi[locale];
}
