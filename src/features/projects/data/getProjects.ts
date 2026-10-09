import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../../../shared/i18n/locales';
import { parseEntryId } from '../domain/entryId';
import type { ProjectSummary } from '../domain/project';

export type ProjectEntry = CollectionEntry<'projects'>;

export interface ProjectItem extends ProjectSummary {
  locale: Locale;
  entry: ProjectEntry;
}

/** Loads every project of one locale as plain items the domain selectors accept. */
export async function getProjects(locale: Locale): Promise<ProjectItem[]> {
  const entries = await getCollection('projects');
  return entries.flatMap((entry) => {
    const parsed = parseEntryId(entry.id);
    if (!parsed || parsed.locale !== locale) return [];
    const { title, year, status, featured, order } = entry.data;
    return [{ slug: parsed.slug, title, year, status, featured, order, locale, entry }];
  });
}
