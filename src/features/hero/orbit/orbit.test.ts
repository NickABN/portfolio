import { describe, expect, it } from 'vitest';
import {
  advance,
  clampPitch,
  ease,
  projectionStyle,
  fibonacciSphere,
  IDLE_SPEED,
  MAX_PITCH,
  project,
  rotate,
  steerTarget,
  type Vec3,
} from './orbit';

const length = ([x, y, z]: Vec3): number => Math.hypot(x, y, z);

describe('fibonacciSphere', () => {
  it('returns n unit vectors from the north pole to the south pole', () => {
    const points = fibonacciSphere(14);
    expect(points).toHaveLength(14);
    expect(points[0]![1]).toBeCloseTo(1);
    expect(points[13]![1]).toBeCloseTo(-1);
    for (const point of points) expect(length(point)).toBeCloseTo(1);
  });

  it('spreads points apart (no two coincide)', () => {
    const points = fibonacciSphere(14);
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i]!;
        const b = points[j]!;
        expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeGreaterThan(0.2);
      }
    }
  });

  it('handles degenerate sizes', () => {
    expect(fibonacciSphere(0)).toEqual([]);
    expect(fibonacciSphere(1)).toEqual([[0, 1, 0]]);
  });
});

describe('rotate', () => {
  it('keeps points on the unit sphere', () => {
    for (const point of rotate(fibonacciSphere(14), 0.7, 2.1)) expect(length(point)).toBeCloseTo(1);
  });

  it('is the identity for zero angles', () => {
    const points = fibonacciSphere(5);
    rotate(points, 0, 0).forEach((p, i) => p.forEach((v, k) => expect(v).toBeCloseTo(points[i]![k]!)));
  });

  it('turns the front axis toward +x for a quarter turn about y', () => {
    const [p] = rotate([[0, 0, 1]], 0, Math.PI / 2);
    expect(p![0]).toBeCloseTo(1);
    expect(p![1]).toBeCloseTo(0);
    expect(p![2]).toBeCloseTo(0);
  });

  it('does not mutate its input', () => {
    const points: Vec3[] = [[0, 0, 1]];
    rotate(points, 1, 1);
    expect(points).toEqual([[0, 0, 1]]);
  });
});

describe('project', () => {
  const view = { radius: 130, distance: 520 };

  it('makes the nearest point largest and opaque, the farthest smallest and faint', () => {
    const front = project([0, 0, 1], view);
    const back = project([0, 0, -1], view);
    expect(front.scale).toBeCloseTo(1.1);
    expect(front.opacity).toBeCloseTo(1);
    expect(back.scale).toBeCloseTo(0.6);
    expect(back.opacity).toBeCloseTo(0.25);
    expect(front.z).toBeGreaterThan(back.z);
  });

  it('centres the middle depth at scale 0.85 and opacity 0.625', () => {
    const mid = project([0, 0, 0], view);
    expect(mid.x).toBeCloseTo(0);
    expect(mid.y).toBeCloseTo(0);
    expect(mid.scale).toBeCloseTo(0.85);
    expect(mid.opacity).toBeCloseTo(0.625);
  });

  it('magnifies offsets of near points through perspective', () => {
    const near = project([0.5, 0, Math.sqrt(0.75)], view);
    const far = project([0.5, 0, -Math.sqrt(0.75)], view);
    expect(near.x).toBeGreaterThan(far.x);
    expect(near.x).toBeGreaterThan(0.5 * view.radius);
  });

  it('uses screen coordinates where y grows downwards', () => {
    expect(project([0, 1, 0], view).y).toBeGreaterThan(0);
  });
});

describe('steerTarget', () => {
  it('maps the pointer position to rotation speeds', () => {
    expect(steerTarget(0.5, 0)).toEqual({ x: 0, y: 0.02 });
    expect(steerTarget(0, 0.5)).toEqual({ x: -0.015, y: 0 });
    expect(steerTarget(-0.5, -0.5)).toEqual({ x: 0.015, y: -0.02 });
  });

  it('is at rest at the centre of the figure', () => {
    expect(steerTarget(0, 0)).toEqual({ x: 0, y: 0 });
  });

  it('clamps coordinates outside the figure', () => {
    expect(steerTarget(5, -5)).toEqual({ x: 0.015, y: 0.02 });
  });
});

describe('ease', () => {
  it('moves a fraction of the way to the target', () => {
    expect(ease(0, 10, 0.1)).toBeCloseTo(1);
    expect(ease(10, 0, 0.5)).toBeCloseTo(5);
  });

  it('stays put at the target', () => {
    expect(ease(3, 3, 0.4)).toBe(3);
  });
});

describe('clampPitch', () => {
  it('limits the tilt so the poles never flip over', () => {
    expect(clampPitch(5)).toBe(MAX_PITCH);
    expect(clampPitch(-5)).toBe(-MAX_PITCH);
    expect(clampPitch(0.3)).toBe(0.3);
    expect(MAX_PITCH).toBe(1.1);
  });
});

describe('advance', () => {
  it('eases speed to the target and integrates the angles', () => {
    const next = advance({ angle: { x: 0, y: 0 }, speed: { x: 0, y: 0 } }, { x: 0, y: 0.1 }, 0.5);
    expect(next.speed.y).toBeCloseTo(0.05);
    expect(next.angle.y).toBeCloseTo(0.05);
    expect(next.angle.x).toBe(0);
  });

  it('clamps the pitch', () => {
    const next = advance({ angle: { x: 1.09, y: 0 }, speed: { x: 1, y: 0 } }, { x: 1, y: 0 }, 0.1);
    expect(next.angle.x).toBe(MAX_PITCH);
  });

  it('settles to the idle spin', () => {
    let state = { angle: { x: 0, y: 0 }, speed: { x: 0.02, y: 0.02 } };
    for (let i = 0; i < 200; i += 1) state = advance(state, IDLE_SPEED, 0.06);
    expect(state.speed.x).toBeCloseTo(0);
    expect(state.speed.y).toBeCloseTo(IDLE_SPEED.y);
  });
});

describe('projectionStyle', () => {
  it('formats a projection as the inline style of a centred logo', () => {
    expect(projectionStyle({ x: 12.345, y: -6.78, scale: 0.85, opacity: 0.625, z: 50 })).toEqual({
      transform: 'translate(-50%, -50%) translate(12.3px, -6.8px) scale(0.850)',
      opacity: '0.625',
      zIndex: '50',
    });
  });
});
