import { describe, expect, it } from 'vitest';
import { techStack } from './techStack';

describe('techStack', () => {
  it('lists the 22 technologies in display order', () => {
    expect(techStack.map((t) => t.name)).toEqual([
      'Flutter',
      'AWS',
      'TypeScript',
      'React',
      'Vue',
      'Astro',
      'NestJS',
      'Python',
      'FastAPI',
      'Django',
      'Java',
      'Spring Boot',
      'Apache Spark',
      'Hadoop',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Docker',
      'Terraform',
      'pandas',
      'NumPy',
      'scikit-learn',
    ]);
  });

  it('has a usable icon and a source for every entry', () => {
    for (const tech of techStack) {
      expect(tech.path.length).toBeGreaterThan(20);
      expect(tech.viewBox).toMatch(/^0 0 \d+ \d+$/);
      expect(tech.size).toBeGreaterThan(0);
      expect(tech.source).toMatch(/^(simple-icons|devicon)@/);
    }
  });
});
