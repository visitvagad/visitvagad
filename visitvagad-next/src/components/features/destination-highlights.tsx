import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import type { Highlight } from '@/types';

export function DestinationHighlights({ highlights }: { highlights: Highlight[] }) {
  return (
    <Section spacing="md" className="bg-surface-alt">
      <Container>
        <FadeIn>
          <Heading as="h2">Highlights</Heading>
        </FadeIn>
        <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((h) => (
            <StaggerItem key={h.title}>
              <div className="text-center">
                <span className="text-4xl">{h.icon}</span>
                <h3 className="mt-4 text-xl font-medium text-text-primary">{h.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{h.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
