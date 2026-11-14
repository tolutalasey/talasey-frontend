'use client';

import '@/tokens/tokens.css';
import './globals.css';
import { ErrorPage } from '@/ui/ErrorPage/ErrorPage';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en-GB">
      <body>
        <main>
          <ErrorPage onRetry={reset} />
        </main>
      </body>
    </html>
  );
}
