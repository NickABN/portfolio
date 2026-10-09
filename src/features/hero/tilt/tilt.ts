export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Tilt {
  rotateX: number;
  rotateY: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/**
 * Tilt toward the pointer, relative to the center of `rect`. Reaches `maxDeg`
 * at the edges and never exceeds it, however far the pointer is.
 */
export function tiltFromPointer(x: number, y: number, rect: Rect, maxDeg: number): Tilt {
  if (rect.width <= 0 || rect.height <= 0) return { rotateX: 0, rotateY: 0 };
  const nx = clamp((x - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1);
  const ny = clamp((y - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1);
  // `0 -` keeps a centered pointer at +0 instead of -0.
  return { rotateX: 0 - ny * maxDeg, rotateY: nx * maxDeg };
}

/** One easing step toward `target`; snaps once within `epsilon` so frames can stop. */
export function easeToward(current: number, target: number, factor: number, epsilon = 0.01): number {
  const next = current + (target - current) * factor;
  return Math.abs(target - next) < epsilon ? target : next;
}
