'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Drawer } from '@/ui/Modal/Modal';

// The bag sliding in from the right over the page the shopper was on. Closing it goes back to
// that page; following a link inside it moves on and the drawer goes with it.
export function BagDrawer({ children }: { children: ReactNode }) {
  const router = useRouter();
  const onBag = usePathname() === '/basket/';
  if (!onBag) return null;
  return (
    <Drawer
      title="Your bag"
      isOpen
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      {children}
    </Drawer>
  );
}
