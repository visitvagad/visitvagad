import { Container, Button } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cta-vagad.jpg')" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-surface-dark/60" />
      </div>

      <Container className="relative z-10 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold text-off-white tracking-tight">
            Begin Your Vagad Story
          </h2>
          <p className="mt-4 text-lg text-off-white/80 max-w-xl mx-auto">
            Plan your journey through tribal heritage, sacred rivers, and timeless landscapes.
          </p>
          <Link href="/plan-your-trip" className="inline-block mt-8">
            <Button size="lg">Start Planning</Button>
          </Link>
        </FadeIn>
      </Container>
    </section>
  );
}
