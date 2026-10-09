/** Owner data. Replace the bracketed placeholders with real facts. */
export const site = {
  name: '[Your Name]',
  /** Public origin of the deployed site; used for canonical and hreflang URLs. */
  url: 'https://example.com',
  /** Year shown in the footer. Kept here so builds are deterministic. */
  copyrightYear: 2026,
  role: 'Software Engineer',
  city: '[City, Country]',
  email: '[you@email.com]',
  linkedin: '#',
  github: '#',
  cvPath: '/cv.pdf',
  /** True until a real portrait is added to the project. */
  portraitIsPlaceholder: true,
} as const;
