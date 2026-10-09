import { describe, expect, it } from 'vitest';
import { selectArchive, selectFeatured, statusMeta, type ProjectSummary } from './project';

function make(overrides: Partial<ProjectSummary> & { slug: string }): ProjectSummary {
  return {
    title: overrides.slug,
    year: 2025,
    status: 'live',
    featured: false,
    ...overrides,
  };
}

describe('selectFeatured', () => {
  it('keeps only featured projects', () => {
    const result = selectFeatured([
      make({ slug: 'a', featured: true }),
      make({ slug: 'b' }),
    ]);
    expect(result.map((p) => p.slug)).toEqual(['a']);
  });

  it('orders by explicit order, then year descending', () => {
    const result = selectFeatured([
      make({ slug: 'old', featured: true, year: 2023 }),
      make({ slug: 'second', featured: true, order: 2, year: 2026 }),
      make({ slug: 'first', featured: true, order: 1, year: 2020 }),
      make({ slug: 'new', featured: true, year: 2026 }),
    ]);
    expect(result.map((p) => p.slug)).toEqual(['first', 'second', 'new', 'old']);
  });

  it('does not mutate the input', () => {
    const input = [make({ slug: 'b', featured: true, year: 2020 }), make({ slug: 'a', featured: true, year: 2026 })];
    selectFeatured(input);
    expect(input.map((p) => p.slug)).toEqual(['b', 'a']);
  });
});

describe('selectArchive', () => {
  it('excludes featured projects and orders by year descending, then title', () => {
    const result = selectArchive([
      make({ slug: 'f', featured: true, year: 2030 }),
      make({ slug: 'z', title: 'Zeta', year: 2024 }),
      make({ slug: 'a', title: 'Alpha', year: 2024 }),
      make({ slug: 'n', title: 'New', year: 2026 }),
    ]);
    expect(result.map((p) => p.slug)).toEqual(['n', 'a', 'z']);
  });
});

describe('statusMeta', () => {
  it('maps each status to a mark and tone', () => {
    expect(statusMeta('live')).toEqual({ mark: '●', tone: 'live' });
    expect(statusMeta('in-progress')).toEqual({ mark: '○', tone: 'accent' });
    expect(statusMeta('archived')).toEqual({ mark: '–', tone: 'muted' });
  });
});
