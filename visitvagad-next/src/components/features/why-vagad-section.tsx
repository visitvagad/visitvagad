import { Section, Container, Heading } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';

const stats = [
  { value: '1,500+', label: 'Years of Heritage' },
  { value: '100+', label: 'Islands in Banswara' },
  { value: '2', label: 'UNESCO-worthy Sites' },
];

export function WhyVagadSection() {
  return (
    <Section spacing="lg">
      <Container className="max-w-4xl text-center">
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
            Why Vagad
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Heading as="h2">
            A Land Time Forgot to Change
          </Heading>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            Vagad is where ancient Bhil traditions flow unbroken through generations, where sacred rivers meet at timeless confluences, and where every hill holds a story of resistance and devotion. This is not mass tourism — this is cultural immersion.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <dl className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8" aria-label="Key facts about Vagad">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-bold text-deep-teal">{stat.value}</dd>
                <dt className="mt-1 text-sm text-text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </FadeIn>
      </Container>
    </Section>
  );
}
