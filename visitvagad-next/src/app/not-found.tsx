import Link from 'next/link';
import { Section, Container, Heading, Button } from '@/components/ui';

export default function NotFound() {
  return (
    <Section spacing="lg">
      <Container className="text-center max-w-xl">
        <p className="text-6xl font-bold text-deep-teal">404</p>
        <Heading as="h1" className="mt-4">Page Not Found</Heading>
        <p className="mt-4 text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="inline-block mt-8">
          <Button>Back to Home</Button>
        </Link>
      </Container>
    </Section>
  );
}
