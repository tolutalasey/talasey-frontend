import '@/tokens/tokens.css';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

// Self-hosted from src/tokens: Latin subset, Jost 500-600 and Mulish 400-700, 33 KB together.
const jost = localFont({
  src: '../tokens/fonts/jost-wght-500-600.woff2',
  weight: '500 600',
  variable: '--font-jost',
  display: 'swap',
});

const mulish = localFont({
  src: '../tokens/fonts/mulish-wght-400-700.woff2',
  weight: '400 700',
  variable: '--font-mulish',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: '#5E2378',
};

// Only what every page shares. The shop's header, footer and consent live in (site), and the
// staff tools in (staff), so neither adds its code to the other's pages.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.locale} className={`${jost.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  );
}
