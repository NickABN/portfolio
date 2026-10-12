import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { figureKinds } from './features/projects/domain/figures';
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
      // `contain` shows the whole image on the plate (diagrams); `cover` crops to fill (screenshots).
      coverFit: z.enum(['cover', 'contain']).default('cover'),
      caption: z.string().optional(),
      // Extra figures for the detail page, grouped by `kind` ("How it works" for diagrams, "Plates" for the rest).
      figures: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string(), kind: z.enum(figureKinds) }))
        .optional(),
      client: z.boolean().default(false),
      highlights: z.array(z.object({ value: z.string(), label: z.string() })).max(3).optional(),
    }),
});

export const collections = { projects };
