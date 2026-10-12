import { describe, expect, it } from 'vitest';
import { figureSectionNumbers, groupFigures, type FigureKind } from './figures';

const fig = (kind: FigureKind, id: string) => ({ kind, id });

describe('groupFigures', () => {
  it('returns empty groups when there are no figures', () => {
    expect(groupFigures(undefined)).toEqual({ diagrams: [], plates: [] });
    expect(groupFigures([])).toEqual({ diagrams: [], plates: [] });
  });

  it('puts diagrams in one group and screens and composites in the other', () => {
    const { diagrams, plates } = groupFigures([
      fig('screen', 's'),
      fig('diagram', 'd'),
      fig('composite', 'c'),
    ]);
    expect(diagrams.map((item) => item.figure.id)).toEqual(['d']);
    expect(plates.map((item) => item.figure.id)).toEqual(['s', 'c']);
  });

  it('numbers from FIG. 2 because the hero cover is FIG. 1', () => {
    const { diagrams } = groupFigures([fig('diagram', 'a'), fig('diagram', 'b')]);
    expect(diagrams.map((item) => item.number)).toEqual([2, 3]);
  });

  it('continues the numbering from the diagrams into the plates', () => {
    const { diagrams, plates } = groupFigures([
      fig('screen', 's1'),
      fig('diagram', 'd1'),
      fig('diagram', 'd2'),
      fig('composite', 'c1'),
    ]);
    expect(diagrams.map((item) => item.number)).toEqual([2, 3]);
    expect(plates.map((item) => [item.figure.id, item.number])).toEqual([
      ['s1', 4],
      ['c1', 5],
    ]);
  });

  it('numbers plates from 2 when there are no diagrams', () => {
    const { diagrams, plates } = groupFigures([fig('screen', 'a'), fig('screen', 'b')]);
    expect(diagrams).toEqual([]);
    expect(plates.map((item) => item.number)).toEqual([2, 3]);
  });

  it('honours a custom first number', () => {
    const { plates } = groupFigures([fig('screen', 'a')], 5);
    expect(plates[0]?.number).toBe(5);
  });
});

describe('figureSectionNumbers', () => {
  it('continues the body numbering with How it works, then Plates', () => {
    const groups = groupFigures([fig('diagram', 'd'), fig('screen', 's')]);
    expect(figureSectionNumbers(3, groups)).toEqual({ howItWorks: 4, plates: 5 });
  });

  it('gives Plates the next number when there are no diagrams', () => {
    const groups = groupFigures([fig('screen', 's'), fig('composite', 'c')]);
    expect(figureSectionNumbers(3, groups)).toEqual({ howItWorks: undefined, plates: 4 });
  });

  it('numbers only How it works when there are no plates', () => {
    const groups = groupFigures([fig('diagram', 'd')]);
    expect(figureSectionNumbers(2, groups)).toEqual({ howItWorks: 3, plates: undefined });
  });

  it('numbers nothing when there are no figures', () => {
    expect(figureSectionNumbers(3, groupFigures([]))).toEqual({ howItWorks: undefined, plates: undefined });
  });
});
