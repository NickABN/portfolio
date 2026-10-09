export function totalLength(segments: readonly string[]): number {
  return segments.reduce((sum, segment) => sum + segment.length, 0);
}

/** Returns each segment cut to what has been typed after `count` characters overall. */
export function sliceSegments(segments: readonly string[], count: number): string[] {
  let remaining = Math.max(0, Math.floor(count));
  return segments.map((segment) => {
    const shown = segment.slice(0, remaining);
    remaining -= shown.length;
    return shown;
  });
}
