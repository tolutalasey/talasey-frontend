import type { ReactNode } from 'react';
import { ShopChrome } from '../ShopChrome';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <ShopChrome>{children}</ShopChrome>;
}
