export const projectStatuses = ['live', 'in-progress', 'archived'] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

/** The fields the selectors need; richer project data extends this shape. */
export interface ProjectSummary {
  slug: string;
  title: string;
  year: number;
  status: ProjectStatus;
  featured: boolean;
  order?: number;
}

export type StatusTone = 'live' | 'accent' | 'muted';

export interface StatusMeta {
  mark: '●' | '○' | '–';
  tone: StatusTone;
}

const byYearThenTitle = (a: ProjectSummary, b: ProjectSummary): number =>
  b.year - a.year || a.title.localeCompare(b.title);

/** Featured projects: explicit `order` first, then newest first. */
export function selectFeatured<T extends ProjectSummary>(projects: readonly T[]): T[] {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || b.year - a.year || a.title.localeCompare(b.title));
}

/** Everything that is not featured, newest first, then alphabetical. */
export function selectArchive<T extends ProjectSummary>(projects: readonly T[]): T[] {
  return projects.filter((project) => !project.featured).sort(byYearThenTitle);
}

const statusTable: Record<ProjectStatus, StatusMeta> = {
  live: { mark: '●', tone: 'live' },
  'in-progress': { mark: '○', tone: 'accent' },
  archived: { mark: '–', tone: 'muted' },
};

export function statusMeta(status: ProjectStatus): StatusMeta {
  return statusTable[status];
}
