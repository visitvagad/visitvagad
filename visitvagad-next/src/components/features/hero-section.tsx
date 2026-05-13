'use client';

import { Button } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[480px] max-h-[900px] flex items-center justify-center overflow-hidden -mt-16 md:-mt-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-vagad.jpg')" }}
        role="img"
        aria-label="Aerial view of the Vagad region landscape"
      >
        <div className="absolute inset-0 bg-surface-dark/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-6 max-w-4xl mx-auto">
        <FadeIn delay={0.2}>
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-off-white/80 mb-3 sm:mb-4">
            Rajasthan&apos;s Hidden Heritage
          </p>
        </FadeIn>
        <FadeIn delay={0.4}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-off-white tracking-tight leading-[1.1]">
            Discover Vagad
          </h1>
        </FadeIn>
        <FadeIn delay={0.6}>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-off-white/80 max-w-2xl mx-auto leading-relaxed">
            Where tribal heritage meets untouched nature — explore the sun-drenched soul of Banswara and Dungarpur.
          </p>
        </FadeIn>
        <FadeIn delay={0.8}>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/destinations" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">Explore Destinations</Button>
            </Link>
            <Link href="/plan-your-trip" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-off-white border border-off-white/30 hover:bg-off-white/10">
                Plan Your Trip
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
