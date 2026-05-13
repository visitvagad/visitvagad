import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Events & Festivals',
  description: 'Experience vibrant tribal festivals, cultural events, and celebrations across Banswara and Dungarpur.',
};

export default function EventsPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1">Events & Festivals</Heading>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl">
          Vibrant tribal festivals, cultural events, and celebrations of the Vagad region.
        </p>
      </Container>
    </Section>
  );
}
