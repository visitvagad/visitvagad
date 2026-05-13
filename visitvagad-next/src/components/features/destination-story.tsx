import { Section, Container } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';

export function DestinationStory({ story }: { story: string }) {
  return (
    <Section spacing="lg">
      <Container className="max-w-3xl">
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">The Story</p>
          <p className="text-lg text-text-secondary leading-relaxed">{story}</p>
        </FadeIn>
      </Container>
    </Section>
  );
}
