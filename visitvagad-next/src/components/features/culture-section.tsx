import { Section, Container, Heading, Button } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';
import Link from 'next/link';

export function CultureSection() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative aspect-[4/3] lg:h-96 rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/culture-bhil.jpg')" }}
              />
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
              Culture
            </p>
            <Heading as="h2">The Bhil Heritage</Heading>
            <p className="mt-4 text-text-secondary leading-relaxed">
              The Bhil community — one of India&apos;s oldest indigenous peoples — has called Vagad home for millennia. Their art, music, oral traditions, and spiritual practices form the living soul of this region. From Pithora paintings to Ghoomar dance, every tradition carries centuries of wisdom.
            </p>
            <Link href="/culture" className="inline-block mt-6 sm:mt-8">
              <Button variant="secondary">Explore Culture</Button>
            </Link>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
