import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Food',
  description: 'Discover the authentic tribal cuisine and culinary traditions of Rajasthan\'s Vagad region.',
};

export default function FoodPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1">Food & Cuisine</Heading>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl">
          Authentic tribal cuisine and culinary traditions of the Vagad region.
        </p>
      </Container>
    </Section>
  );
}
