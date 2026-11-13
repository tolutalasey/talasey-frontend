import type { Metadata } from 'next';
import { HelpCentre } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Help centre: delivery, returns and more | Talasey',
  description:
    'Answers on delivery, returns, laying, care, paying and samples, and how to get in touch with the Talasey team.',
  path: '/help/',
});

export default function Help() {
  return <HelpCentre />;
}
