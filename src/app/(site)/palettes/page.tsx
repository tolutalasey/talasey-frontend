import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PaletteChoices } from '@/features/palette-preview';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Colour options',
  robots: { index: false, follow: false },
};

// A design tool for the test site only.
export default function Palettes() {
  if (env.APP_ENV === 'production') notFound();
  return <PaletteChoices />;
}
