import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Plan Your Trip',
  description: 'Plan your visit to Rajasthan\'s Vagad region — travel tips, best time to visit, getting there, and essential information.',
};

export default function PlanYourTripPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1">Plan Your Trip</Heading>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl">
          Everything you need to plan your visit to the Vagad region.
        </p>
      </Container>
    </Section>
  );
}
