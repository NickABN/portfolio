/** Owner data. */
export const site = {
  name: 'Nicolás Basilio',
  /** Public origin of the deployed site; used for canonical and hreflang URLs. */
  url: 'https://nickabn-portfolio.netlify.app',
  /** Year shown in the footer. Kept here so builds are deterministic. */
  copyrightYear: 2026,
  role: 'Software Engineer',
  city: 'Morelia, México',
  email: 'basilio.nava.nicolas@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nicolas-a-basilio-nava',
  github: 'https://github.com/NickABN',
  cvPath: '/cv.pdf',
  /** True until a real portrait is added to the project. */
  portraitIsPlaceholder: false,
} as const;
