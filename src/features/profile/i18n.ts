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
    quote: '“The fastest server is the request you never send.”',
    story1:
      'I studied Computer Systems Engineering at the Instituto Tecnológico de Morelia, where I built my first production system: a Laravel platform to automate social service at the campus. In 2024 I joined Kiritek and moved fast from features to ownership — IoT access control, WhatsApp assistants with LLMs, mobile apps and the cloud underneath them.',
    story2: 'Two-plus years in production across residential communities, events and private clubs, leading a three-person squad, reviewing code and mentoring the team — including a seven-module course on AI-driven development. Now I am focused on cloud architecture on AWS and on building products of my own.',
    skills: [
      { group: 'Backend', items: 'Python, FastAPI, Java, Spring Boot, NestJS' },
      { group: 'Mobile & web', items: 'Flutter, BLoC, React, Vue' },
      { group: 'Cloud & data', items: 'AWS, CDK, Terraform, Docker, MySQL, PostgreSQL, DynamoDB' },
      { group: 'Practice', items: 'Clean architecture, testing, CI/CD, applied LLMs' },
    ],
  },
  es: {
    title: 'Perfil',
    section: 'Sección III — El autor',
    portraitPlaceholder: '[Tu retrato — blanco y negro]',
    portraitLabel: 'Retrato',
    quote: '«El servidor más rápido es la petición que nunca envías.»',
    story1:
      'Estudié Ingeniería en Sistemas Computacionales en el Instituto Tecnológico de Morelia, donde construí mi primer sistema en producción: una plataforma en Laravel para automatizar el servicio social del campus. En 2024 entré a Kiritek y pasé rápido de hacer features a ser dueño de sistemas: control de acceso IoT, asistentes de WhatsApp con LLMs, apps móviles y la nube que las sostiene.',
    story2: 'Más de dos años en producción entre comunidades residenciales, eventos y clubes privados, liderando un squad de tres personas, revisando código y formando al equipo, incluido un curso de siete módulos sobre desarrollo con IA. Hoy estoy enfocado en arquitectura cloud en AWS y en construir productos propios.',
    skills: [
      { group: 'Backend', items: 'Python, FastAPI, Java, Spring Boot, NestJS' },
      { group: 'Móvil y web', items: 'Flutter, BLoC, React, Vue' },
      { group: 'Nube y datos', items: 'AWS, CDK, Terraform, Docker, MySQL, PostgreSQL, DynamoDB' },
      { group: 'Práctica', items: 'Arquitectura limpia, testing, CI/CD, LLMs aplicados' },
    ],
  },
};

export function useProfileUi(locale: Locale): ProfileStrings {
  return profileUi[locale];
}
