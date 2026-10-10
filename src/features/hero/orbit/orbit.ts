export type Vec3 = readonly [number, number, number];

export interface Vec2 {
  x: number;
  y: number;
}

export interface View {
  /** Sphere radius in pixels. */
  radius: number;
  /** Camera distance in pixels; smaller values exaggerate perspective. */
  distance: number;
}

export interface Projected {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  z: number;
}

export interface OrbitState {
  /** Rotation about the x axis (pitch) and the y axis (yaw), in radians. */
  angle: Vec2;
  /** Per-frame angular speed, in radians. */
  speed: Vec2;
}

/** Slow spin the sphere returns to when nobody steers it. */
export const IDLE_SPEED: Readonly<Vec2> = { x: 0, y: 0.004 };
/** Pitch limit that keeps the poles from flipping over. */
export const MAX_PITCH = 1.1;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** Evenly spread unit vectors on a sphere (Fibonacci lattice), from the north to the south pole. */
export function fibonacciSphere(n: number): Vec3[] {
  if (n <= 0) return [];
  if (n === 1) return [[0, 1, 0]];
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r] as const;
  });
}

/** Rotates about y by `ay`, then about x by `ax`. Returns new points. */
export function rotate(points: readonly Vec3[], ax: number, ay: number): Vec3[] {
  const [sx, cx, sy, cy] = [Math.sin(ax), Math.cos(ax), Math.sin(ay), Math.cos(ay)];
  return points.map(([x, y, z]) => {
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    return [x1, y * cx - z1 * sx, y * sx + z1 * cx] as const;
  });
}

/** Perspective projection of a rotated unit vector; the nearer (z = 1) the larger and more opaque. */
export function project([x, y, z]: Vec3, { radius, distance }: View): Projected {
  const perspective = distance / (distance - z * radius);
  const depth = (z + 1) / 2;
  return {
    x: x * radius * perspective,
    y: y * radius * perspective,
    scale: 0.6 + depth * 0.5,
    opacity: 0.25 + depth * 0.75,
    z: Math.round(depth * 100),
  };
}

/** Target speeds for a pointer at (nx, ny), each normalised to -0.5..0.5 across the figure. */
export function steerTarget(nx: number, ny: number): Vec2 {
  // `0 -` keeps a centred pointer at +0 instead of -0.
  return { x: 0 - clamp(ny, -0.5, 0.5) * 0.03, y: clamp(nx, -0.5, 0.5) * 0.04 };
}

export function ease(current: number, target: number, k: number): number {
  return current + (target - current) * k;
}

export function clampPitch(ax: number): number {
  return clamp(ax, -MAX_PITCH, MAX_PITCH);
}

/** One animation frame: ease the speed toward `target`, then integrate the angles. */
export function advance({ angle, speed }: OrbitState, target: Vec2, k: number): OrbitState {
  const next = { x: ease(speed.x, target.x, k), y: ease(speed.y, target.y, k) };
  return { speed: next, angle: { x: clampPitch(angle.x + next.x), y: angle.y + next.y } };
}

/** Sphere geometry shared by the server render and the client loop (sized for a 300px scene). */
export const ORBIT_VIEW: Readonly<View> = { radius: 130, distance: 520 };
export const ORBIT_SCENE_SIZE = 300;
/** Resting orientation: tilted slightly toward the viewer. */
export const INITIAL_ANGLE: Readonly<Vec2> = { x: -0.3, y: 0 };

export interface ProjectionStyle {
  transform: string;
  opacity: string;
  zIndex: string;
}

/** Inline style that places a logo (anchored at the scene centre) at its projected position. */
export function projectionStyle({ x, y, scale, opacity, z }: Projected): ProjectionStyle {
  return {
    transform: `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)})`,
    opacity: opacity.toFixed(3),
    zIndex: String(z),
  };
}

/** View for a scene of the given pixel width: the radius follows the width, the camera distance does not. */
export function viewForScene(sceneWidth: number): View {
  if (!Number.isFinite(sceneWidth) || sceneWidth <= 0) return { ...ORBIT_VIEW };
  return { ...ORBIT_VIEW, radius: (ORBIT_VIEW.radius * sceneWidth) / ORBIT_SCENE_SIZE };
}
