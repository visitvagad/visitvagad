import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Stays',
  description: 'Find eco-lodges, heritage hotels, and authentic stays across Rajasthan\'s Vagad region.',
};

export default function StaysPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1">Stays</Heading>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl">
          Eco-lodges, heritage hotels, and authentic stays across the Vagad region.
        </p>
      </Container>
    </Section>
  );
}
