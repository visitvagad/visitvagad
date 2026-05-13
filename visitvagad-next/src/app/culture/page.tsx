import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Culture & Heritage',
  description: 'Explore the rich Bhil tribal heritage, art, traditions, and cultural stories of Rajasthan\'s Vagad region.',
};

export default function CulturePage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1">Culture & Heritage</Heading>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl">
          Bhil tribal heritage, art, traditions, and cultural stories of the Vagad region.
        </p>
      </Container>
    </Section>
  );
}
