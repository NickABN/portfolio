import { describe, expect, it } from 'vitest';
import motionCss from './motion.css?raw';

/** Rule bodies (text between braces) that declare a scroll or view timeline. */
function timelineRules(css: string): string[] {
  return [...css.matchAll(/\{([^{}]*animation-timeline[^{}]*)\}/g)].map((match) => match[1]);
}

describe('motion.css', () => {
  it('declares scroll-driven animations', () => {
    expect(timelineRules(motionCss).length).toBeGreaterThan(0);
  });

  // Lightning CSS folds `animation` + `animation-timeline` into one shorthand,
  // which browsers reject, silently dropping every scroll animation.
  it('never mixes the animation shorthand with animation-timeline', () => {
    for (const body of timelineRules(motionCss)) {
      expect(body).not.toMatch(/(^|[\s;])animation\s*:/);
    }
  });
});
