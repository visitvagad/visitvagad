import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore heritage sites, lakes, waterfalls, and hidden gems across Banswara and Dungarpur in Rajasthan\'s Vagad region.',
};

export default function DestinationsPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1">Destinations</Heading>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl">
          Heritage sites, lakes, waterfalls, and hidden gems across the Vagad region.
        </p>
      </Container>
    </Section>
  );
}
