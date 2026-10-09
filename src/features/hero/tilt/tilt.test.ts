import { describe, expect, it } from 'vitest';
import { easeToward, tiltFromPointer } from './tilt';

const rect = { left: 100, top: 200, width: 200, height: 100 };

describe('tiltFromPointer', () => {
  it('is flat when the pointer is at the center', () => {
    expect(tiltFromPointer(200, 250, rect, 12)).toEqual({ rotateX: 0, rotateY: 0 });
  });

  it('tilts toward the pointer', () => {
    // Right edge: positive rotateY. Top edge: positive rotateX (top leans toward the viewer).
    expect(tiltFromPointer(300, 250, rect, 12)).toEqual({ rotateX: 0, rotateY: 12 });
    expect(tiltFromPointer(200, 200, rect, 12)).toEqual({ rotateX: 12, rotateY: 0 });
  });

  it('never exceeds the maximum angle', () => {
    expect(tiltFromPointer(10_000, -10_000, rect, 12)).toEqual({ rotateX: 12, rotateY: 12 });
    expect(tiltFromPointer(-10_000, 10_000, rect, 12)).toEqual({ rotateX: -12, rotateY: -12 });
  });

  it('is flat for a degenerate rectangle', () => {
    expect(tiltFromPointer(5, 5, { left: 0, top: 0, width: 0, height: 0 }, 12)).toEqual({ rotateX: 0, rotateY: 0 });
  });
});

describe('easeToward', () => {
  it('moves a fraction of the way to the target', () => {
    expect(easeToward(0, 10, 0.2)).toBe(2);
  });

  it('snaps when close enough to avoid endless frames', () => {
    expect(easeToward(9.99, 10, 0.2, 0.05)).toBe(10);
  });
});
