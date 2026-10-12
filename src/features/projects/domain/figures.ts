export const figureKinds = ['diagram', 'screen', 'composite'] as const;
export type FigureKind = (typeof figureKinds)[number];

/** The only field the grouping needs; richer figure data extends this shape. */
export interface FigureLike {
  kind: FigureKind;
}

export interface NumberedFigure<T extends FigureLike> {
  figure: T;
  /** Figure number as printed in the caption ("FIG. 2"). */
  number: number;
}

export interface FigureGroups<T extends FigureLike> {
  /** "How it works": architecture and flow diagrams, shown wider than the text column. */
  diagrams: NumberedFigure<T>[];
  /** "Plates": product screenshots (framed) and composites. */
  plates: NumberedFigure<T>[];
}

/**
 * Splits a project's figures into the two detail-page sections and numbers them in reading order:
 * diagrams first, then plates, each group keeping its authoring order. The hero cover is FIG. 1,
 * so numbering starts at `firstNumber` (2 by default).
 */
export function groupFigures<T extends FigureLike>(
  figures: readonly T[] | undefined,
  firstNumber = 2,
): FigureGroups<T> {
  const list = figures ?? [];
  const diagrams = list.filter((figure) => figure.kind === 'diagram');
  const plates = list.filter((figure) => figure.kind !== 'diagram');
  return {
    diagrams: diagrams.map((figure, index) => ({ figure, number: firstNumber + index })),
    plates: plates.map((figure, index) => ({ figure, number: firstNumber + diagrams.length + index })),
  };
}
