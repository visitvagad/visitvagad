import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title,
    description: `${title} — tribal heritage and culture of Rajasthan's Vagad region.`,
  };
}

export default async function CultureDetailPage({ params }: Props) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1">{title}</Heading>
        <p className="mt-4 text-lg text-text-secondary">
          Culture details coming soon.
        </p>
      </Container>
    </Section>
  );
}
