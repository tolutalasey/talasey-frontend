import type { ReactNode } from 'react';
import { requireStaff, StaffShell, type StaffLink } from '@/features/staff';

const LINKS: StaffLink[] = [
  { href: '/admin/products/', label: 'Products', permission: 'catalogue' },
  { href: '/admin/colour-sets/', label: 'Colour sets', permission: 'catalogue' },
  { href: '/admin/catalogue/', label: 'Import and export', permission: 'catalogue' },
  { href: '/admin/orders/', label: 'Orders', permission: 'orders' },
  { href: '/admin/samples/', label: 'Samples', permission: 'orders' },
  { href: '/admin/promotions/', label: 'Promotions', permission: 'catalogue' },
  { href: '/admin/delivery/', label: 'Delivery', permission: 'delivery' },
  { href: '/admin/sku-checks/', label: 'SKU checks', permission: 'catalogue' },
  { href: '/admin/log/', label: 'Change log', permission: 'audit' },
  { href: '/admin/users/', label: 'Staff', permission: 'users' },
  { href: '/content/', label: 'Content', permission: 'content.edit' },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { me } = await requireStaff('admin');
  return (
    <StaffShell area="admin" title="Talasey admin" links={LINKS} me={me}>
      {children}
    </StaffShell>
  );
}
