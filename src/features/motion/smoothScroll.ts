import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { resolveHashTarget, shouldEnableSmoothScroll } from './guards';

function focusTarget(target: HTMLElement): void {
  if (!target.hasAttribute('tabindex') && !target.matches('a[href], button, input, select, textarea')) {
    target.setAttribute('tabindex', '-1');
  }
  target.focus({ preventScroll: true });
}

/** Starts Lenis and routes same-page anchor clicks through it. Returns the instance, or null. */
export function initSmoothScroll(): Lenis | null {
  const enabled = shouldEnableSmoothScroll({
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
  });
  if (!enabled) return null;

  // Lenis drives the native root scroll position, so CSS scroll()/view() timelines keep working.
  const lenis = new Lenis({ autoRaf: true });

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return;

    const id = resolveHashTarget(anchor.getAttribute('href') ?? '', window.location.pathname);
    const target = id ? document.getElementById(id) : null;
    if (!id || !target) return;

    event.preventDefault();
    lenis.scrollTo(target, {
      offset: 0,
      onComplete: () => {
        history.pushState(null, '', `#${encodeURIComponent(id)}`);
        focusTarget(target);
      },
    });
  });

  return lenis;
}

initSmoothScroll();
