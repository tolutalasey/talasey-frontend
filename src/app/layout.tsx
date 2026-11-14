import '@/tokens/tokens.css';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

// Self-hosted from src/tokens, Latin subset: Fraunces with its weight and soft axes for headings,
// Hanken Grotesk for text, 97 KB together.
const fraunces = localFont({
  src: '../tokens/fonts/fraunces-soft-wght.woff2',
  weight: '100 900',
  variable: '--font-fraunces',
  display: 'swap',
});

const hanken = localFont({
  src: '../tokens/fonts/hanken-grotesk-wght.woff2',
  weight: '100 900',
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: '#2B0337',
};

// Only what every page shares. The shop's header, footer and consent live in (site), and the
// staff tools in (staff), so neither adds its code to the other's pages.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={site.locale}
      className={`${fraunces.variable} ${hanken.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
