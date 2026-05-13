import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Itineraries',
  description: 'Curated travel itineraries for exploring Banswara, Dungarpur, and the Vagad region of Rajasthan.',
};

export default function ItinerariesPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1">Itineraries</Heading>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl">
          Curated travel itineraries for exploring the Vagad region.
        </p>
      </Container>
    </Section>
  );
}
