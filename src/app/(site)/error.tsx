'use client';

import { useEffect } from 'react';
import { ErrorPage } from '@/ui/ErrorPage/ErrorPage';

export default function SiteError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPage onRetry={reset} />;
}
