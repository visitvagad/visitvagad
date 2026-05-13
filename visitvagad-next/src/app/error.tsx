'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-alt p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-text-primary">Something went wrong</h1>
        <p className="mt-2 text-sm text-text-muted">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="mt-6 px-5 py-2.5 rounded-xl bg-deep-teal text-white text-sm font-medium hover:bg-deep-teal/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
