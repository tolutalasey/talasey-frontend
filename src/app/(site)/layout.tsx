import type { ReactNode } from 'react';
import { ShopChrome } from '../ShopChrome';

export default function SiteLayout({
  children,
  drawer,
}: {
  children: ReactNode;
  drawer: ReactNode;
}) {
  return (
    <ShopChrome>
      {children}
      {drawer}
    </ShopChrome>
  );
}
