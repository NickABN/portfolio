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
  theFile: string;
  number: string;
  visitProduct: string;
  sourceCode: string;
  privateNote: string;
  clientWork: string;
  stack: string;
  backToWork: string;
  backTo: string;
  nextFeature: string;
  howItWorks: string;
  plates: string;
  openLarger: string;
  closeViewer: string;
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
    theFile: 'The file',
    number: 'No.',
    visitProduct: 'Visit the product',
    sourceCode: 'Source code',
    privateNote: "Private client work. The product isn't public; this page shares the details I'm allowed to.",
    clientWork: 'Client work',
    stack: 'Stack',
    backToWork: '← Selected Work',
    backTo: 'Back to',
    nextFeature: 'Next feature',
    howItWorks: 'How it works',
    plates: 'Plates',
    openLarger: 'Open larger view',
    closeViewer: 'Close',
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
    theFile: 'La ficha',
    number: 'N.º',
    visitProduct: 'Ver el producto',
    sourceCode: 'Código fuente',
    privateNote: 'Trabajo privado para un cliente. El producto no es público; esta página comparte los detalles que puedo mostrar.',
    clientWork: 'Trabajo de cliente',
    stack: 'Stack',
    backToWork: '← Trabajo seleccionado',
    backTo: 'Volver a',
    nextFeature: 'Siguiente proyecto',
    howItWorks: 'Cómo funciona',
    plates: 'Láminas',
    openLarger: 'Abrir vista ampliada',
    closeViewer: 'Cerrar',
    status: { live: 'En línea', 'in-progress': 'En desarrollo', archived: 'Archivado' },
  },
};

export function useProjectsUi(locale: Locale): ProjectsStrings {
  return projectsUi[locale];
}
