import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectStatuses } from './features/projects/domain/project';

// One Markdown file per locale: `content/<locale>/<slug>.md`. The folder gives
// the locale and the file name gives the slug, so adding a project needs no code.
const projects = defineCollection({
  loader: glob({ base: './src/features/projects/content', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number().int(),
      deck: z.string(),
      summary: z.string().optional(),
      role: z.string(),
      stack: z.array(z.string()).min(1),
      status: z.enum(projectStatuses),
      featured: z.boolean().default(false),
      order: z.number().optional(),
      liveUrl: z.url().optional(),
      repoUrl: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      caption: z.string().optional(),
      client: z.boolean().default(false),
    }),
});

export const collections = { projects };
