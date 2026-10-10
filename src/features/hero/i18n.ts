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
  /** Accessible name of the technology list inside Fig. 1. */
  stackLabel: string;
  homeLink: string;
}

export const heroUi: Record<Locale, HeroStrings> = {
  en: {
    role: 'Software Engineer',
    tags: ['Architecture', 'Interfaces', 'Systems'],
    frontKicker: 'Front page',
    headline: ['Software, written', 'with the care of ', 'good prose.'],
    deck: 'Full-stack engineer in Mexico. I build back ends in Java and Python, serverless systems on AWS and Flutter apps, and I put them in front of real users.',
    intro1:
      'I like systems where software meets the physical world: gates that open from an MQTT event, a WhatsApp message that lets a visitor in, a checkout that has to survive a World Cup. I start from the bottleneck, measure before I claim, and prefer the change that removes load over the one that buys more servers.',
    intro2:
      'Today I act as tech lead of a squad at Kiritek, I am building Agendly, my own booking SaaS, and I am studying a master\'s in AI-driven development and a professional AWS programme. I am looking for a team that ships product and cares about how it is built.',
    fig: 'Fig.',
    fig1: 'The working stack. It turns on its own; move your cursor over it to steer.',
    stackLabel: 'Technologies I work with',
    homeLink: 'Back to the front page',
  },
  es: {
    role: 'Ingeniero de Software',
    tags: ['Arquitectura', 'Interfaces', 'Sistemas'],
    frontKicker: 'Portada',
    headline: ['Software escrito', 'con el cuidado de ', 'la buena prosa.'],
    deck: 'Ingeniero full-stack en México. Construyo backends en Java y Python, sistemas serverless en AWS y apps en Flutter, y los pongo frente a usuarios reales.',
    intro1:
      'Me gustan los sistemas donde el software toca el mundo físico: una pluma que se abre con un evento MQTT, un mensaje de WhatsApp que deja pasar a una visita, un checkout que tiene que sobrevivir a un Mundial. Empiezo por el cuello de botella, mido antes de afirmar y prefiero el cambio que quita carga al que compra más servidores.',
    intro2:
      'Hoy soy tech lead de un squad en Kiritek, estoy construyendo Agendly, mi propio SaaS de citas, y estudio un máster en desarrollo con IA y un programa profesional de AWS. Busco un equipo que entregue producto y al que le importe cómo está construido.',
    fig: 'Fig.',
    fig1: 'El stack de trabajo. Gira por su cuenta; mueve el cursor encima para guiarlo.',
    stackLabel: 'Tecnologías con las que trabajo',
    homeLink: 'Volver a la portada',
  },
};

export function useHeroUi(locale: Locale): HeroStrings {
  return heroUi[locale];
}
