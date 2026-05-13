'use client';

import { FadeIn } from '@/components/ui/motion';
import type { Destination } from '@/types';

export function DestinationHero({ destination }: { destination: Destination }) {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] min-h-[400px] max-h-[800px] flex items-end overflow-hidden -mt-16 md:-mt-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${destination.heroImage}')` }}
        role="img"
        aria-label={`${destination.title} landscape`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-surface-dark/30 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <FadeIn>
          <span className="text-xs uppercase tracking-[0.2em] text-terracotta">{destination.district}</span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-6xl font-bold text-off-white tracking-tight leading-[1.1]">
            {destination.title}
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-off-white/80 max-w-2xl">{destination.summary}</p>
        </FadeIn>
      </div>
    </section>
  );
}
