import type { Locale } from '../../shared/i18n/locales';
import type { ProjectStatus } from './domain/project';

export interface ProjectsStrings {
  workTitle: string;
  workSection: string;
  indexTitle: string;
  indexSection: string;
  colYear: string;
  colTitle: string;
  colMedium: string;
  colStatus: string;
  feature: string;
  fig: string;
  role: string;
  shot: string;
  visit: string;
  caseStudy: string;
  source: string;
  opensInNewTab: string;
  backToFront: string;
  clientNote: string;
  status: Record<ProjectStatus, string>;
}

export const projectsUi: Record<Locale, ProjectsStrings> = {
  en: {
    workTitle: 'Selected Work',
    workSection: 'Section I — Features',
    indexTitle: 'The Index',
    indexSection: 'Section II — Everything else, in brief',
    colYear: 'Year',
    colTitle: 'Title',
    colMedium: 'Medium',
    colStatus: 'Status',
    feature: 'Feature',
    fig: 'Fig.',
    role: 'Role',
    shot: '[Screenshot or 10s loop video]',
    visit: 'Visit site',
    caseStudy: 'Read case study',
    source: 'Source',
    opensInNewTab: '(opens in a new tab)',
    backToFront: 'Back to the front page',
    clientNote: 'Client work: details are shared with permission.',
    status: { live: 'Live', 'in-progress': 'In progress', archived: 'Archived' },
  },
  es: {
    workTitle: 'Trabajo seleccionado',
    workSection: 'Sección I — Destacados',
    indexTitle: 'El Índice',
    indexSection: 'Sección II — Todo lo demás, en breve',
    colYear: 'Año',
    colTitle: 'Título',
    colMedium: 'Técnica',
    colStatus: 'Estado',
    feature: 'Destacado',
    fig: 'Fig.',
    role: 'Rol',
    shot: '[Captura o video en loop de 10 s]',
    visit: 'Ver sitio',
    caseStudy: 'Leer caso de estudio',
    source: 'Código',
    opensInNewTab: '(se abre en una pestaña nueva)',
    backToFront: 'Volver a la portada',
    clientNote: 'Trabajo para clientes: los detalles se comparten con autorización.',
    status: { live: 'En línea', 'in-progress': 'En desarrollo', archived: 'Archivado' },
  },
};

export function useProjectsUi(locale: Locale): ProjectsStrings {
  return projectsUi[locale];
}
