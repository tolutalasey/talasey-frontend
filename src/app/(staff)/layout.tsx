import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';

// Staff pages share nothing with the shop's layout, so none of their code reaches shoppers, and
// search engines are told to stay out. They depend on who is signed in, so they render on request.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<p>Loading…</p>}>{children}</Suspense>;
}
