import '@/tokens/tokens.css';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

// Self-hosted from src/tokens, Latin subset: Gilda Display for headings until the brand's
// The Seasons is licensed for the web, Hanken Grotesk for text.
const gilda = localFont({
  src: '../tokens/fonts/gilda-display-400.woff2',
  weight: '400',
  variable: '--font-gilda',
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
  themeColor: '#3F033A',
};

// Only what every page shares. The shop's header, footer and consent live in (site), and the
// staff tools in (staff), so neither adds its code to the other's pages.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={site.locale}
      className={`${gilda.variable} ${hanken.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
