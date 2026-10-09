export interface SmoothScrollContext {
  prefersReducedMotion: boolean;
  /** True on touch-first devices, where native momentum scrolling is better. */
  coarsePointer?: boolean;
}

/** Lenis only runs for motion-tolerant visitors on fine-pointer devices. */
export function shouldEnableSmoothScroll({
  prefersReducedMotion,
  coarsePointer = false,
}: SmoothScrollContext): boolean {
  return !prefersReducedMotion && !coarsePointer;
}

const PLACEHOLDER_ORIGIN = 'https://same-page.invalid';

function trimTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

/**
 * Returns the element id an anchor `href` points to when it targets a fragment
 * of the current page, or `null` for other pages, external URLs and empty hashes.
 */
export function resolveHashTarget(href: string, currentPath: string): string | null {
  let url: URL;
  try {
    url = new URL(href, `${PLACEHOLDER_ORIGIN}${currentPath}`);
  } catch {
    return null;
  }
  if (url.origin !== PLACEHOLDER_ORIGIN) return null;
  if (trimTrailingSlash(url.pathname) !== trimTrailingSlash(currentPath)) return null;

  const fragment = url.hash.slice(1);
  if (fragment === '') return null;
  try {
    return decodeURIComponent(fragment);
  } catch {
    return null;
  }
}
