import { describe, expect, it } from 'vitest';
import {
  fileNumber,
  getNextProject,
  readingOrder,
  selectArchive,
  selectFeatured,
  statusMeta,
  type ProjectSummary,
} from './project';

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

const sample = [
  make({ slug: 'arch-new', title: 'B', year: 2025 }),
  make({ slug: 'second', featured: true, order: 2 }),
  make({ slug: 'first', featured: true, order: 1 }),
  make({ slug: 'arch-old', title: 'A', year: 2020 }),
];

describe('readingOrder', () => {
  it('lists featured projects first, then the archive', () => {
    expect(readingOrder(sample).map((p) => p.slug)).toEqual(['first', 'second', 'arch-new', 'arch-old']);
  });
});

describe('getNextProject', () => {
  it('returns the following project in reading order', () => {
    expect(getNextProject(sample, 'first')?.slug).toBe('second');
    expect(getNextProject(sample, 'second')?.slug).toBe('arch-new');
  });

  it('wraps from the last project to the first', () => {
    expect(getNextProject(sample, 'arch-old')?.slug).toBe('first');
  });

  it('returns undefined for an unknown slug or when there is nothing else to read', () => {
    expect(getNextProject(sample, 'missing')).toBeUndefined();
    expect(getNextProject([make({ slug: 'only' })], 'only')).toBeUndefined();
  });
});

describe('fileNumber', () => {
  it('gives the 1-based, zero-padded position in reading order', () => {
    expect(fileNumber(sample, 'first')).toBe('01');
    expect(fileNumber(sample, 'arch-old')).toBe('04');
  });

  it('returns undefined for an unknown slug', () => {
    expect(fileNumber(sample, 'missing')).toBeUndefined();
  });
});
