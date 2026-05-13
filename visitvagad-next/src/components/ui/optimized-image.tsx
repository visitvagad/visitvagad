'use client';

import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { useState } from 'react';

type AspectRatio = '16:9' | '4:3' | '3:2' | '1:1' | 'hero';

interface OptimizedImageProps extends Omit<NextImageProps, 'width' | 'height'> {
  aspect?: AspectRatio;
  width?: number;
  height?: number;
}

const aspectClasses: Record<AspectRatio, string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '1:1': 'aspect-square',
  hero: 'aspect-[21/9]',
};

/** Tiny 1x1 blurred SVG placeholder */
const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiM3ODcxNmMiLz48L3N2Zz4=';

export function OptimizedImage({
  aspect,
  className = '',
  alt,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-surface-alt flex items-center justify-center ${aspect ? aspectClasses[aspect] : ''} ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-text-muted text-sm">Image unavailable</span>
      </div>
    );
  }

  const isFill = !props.width && !props.height;

  return (
    <NextImage
      {...props}
      alt={alt}
      fill={isFill || undefined}
      className={`object-cover ${className}`}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      onError={() => setError(true)}
    />
  );
}
