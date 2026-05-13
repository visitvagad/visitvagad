import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { experiences } from '@/data';

export function ExperienceGridSection() {
  return (
    <Section spacing="lg" className="bg-surface-alt">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
            Experiences
          </p>
          <Heading as="h2">Immerse Yourself</Heading>
          <p className="mt-4 text-text-secondary max-w-2xl">
            From spiritual journeys to eco-treks — experiences that connect you to the land and its people.
          </p>
        </FadeIn>

        <StaggerContainer className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {experiences.map((exp) => (
            <StaggerItem key={exp.id}>
              <div className="group relative aspect-[4/3] sm:h-64 rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${exp.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-surface-dark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <span className="text-xs uppercase tracking-wider text-terracotta">{exp.category}</span>
                  <h3 className="mt-1 text-lg font-medium text-off-white">{exp.title}</h3>
                  <p className="mt-1 text-sm text-off-white/70">{exp.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
