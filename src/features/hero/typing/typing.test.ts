import { describe, expect, it } from 'vitest';
import { sliceSegments, totalLength } from './typing';

describe('totalLength', () => {
  it('sums the characters of every segment', () => {
    expect(totalLength(['ab', 'cde', ''])).toBe(5);
    expect(totalLength([])).toBe(0);
  });
});

describe('sliceSegments', () => {
  const segments = ['Soft', 'ware ', 'prose.'];

  it('reveals segments in order, one character at a time', () => {
    expect(sliceSegments(segments, 0)).toEqual(['', '', '']);
    expect(sliceSegments(segments, 2)).toEqual(['So', '', '']);
    expect(sliceSegments(segments, 6)).toEqual(['Soft', 'wa', '']);
    expect(sliceSegments(segments, 11)).toEqual(['Soft', 'ware ', 'pr']);
  });

  it('clamps the count to the available range', () => {
    expect(sliceSegments(segments, -3)).toEqual(['', '', '']);
    expect(sliceSegments(segments, 999)).toEqual(segments);
  });

  it('floors fractional counts', () => {
    expect(sliceSegments(['abc'], 1.9)).toEqual(['a']);
  });
});
