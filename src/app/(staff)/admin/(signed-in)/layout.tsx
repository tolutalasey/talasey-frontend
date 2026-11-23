import type { ReactNode } from 'react';
import {
  ChatIcon,
  DeliveryIcon,
  HistoryIcon,
  HomeIcon,
  MailIcon,
  OrdersIcon,
  ProductsIcon,
  requireStaff,
  SampleIcon,
  ShieldIcon,
  StaffShell,
  SwatchIcon,
  TagIcon,
  TeamIcon,
  TransferIcon,
  type StaffNavGroup,
} from '@/features/staff';

const GROUPS: StaffNavGroup[] = [
  { links: [{ href: '/admin/', label: 'Overview', icon: <HomeIcon /> }] },
  {
    label: 'Sell',
    links: [
      { href: '/admin/orders/', label: 'Orders', icon: <OrdersIcon />, permission: 'orders' },
      { href: '/admin/samples/', label: 'Samples', icon: <SampleIcon />, permission: 'orders' },
      {
        href: '/admin/enquiries/',
        label: 'Enquiries',
        icon: <MailIcon />,
        permission: 'enquiries',
      },
      {
        href: '/admin/assistant/',
        label: 'Site assistant',
        icon: <ChatIcon />,
        permission: 'enquiries',
      },
      {
        href: '/admin/promotions/',
        label: 'Promotions',
        icon: <TagIcon />,
        permission: 'catalogue',
      },
    ],
  },
  {
    label: 'Catalogue',
    links: [
      {
        href: '/admin/products/',
        label: 'Products',
        icon: <ProductsIcon />,
        permission: 'catalogue',
      },
      {
        href: '/admin/colour-sets/',
        label: 'Colour sets',
        icon: <SwatchIcon />,
        permission: 'catalogue',
      },
      {
        href: '/admin/sku-checks/',
        label: 'SKU checks',
        icon: <ShieldIcon />,
        permission: 'catalogue',
      },
      {
        href: '/admin/catalogue/',
        label: 'Import and export',
        icon: <TransferIcon />,
        permission: 'catalogue',
      },
    ],
  },
  {
    label: 'Run the shop',
    links: [
      {
        href: '/admin/delivery/',
        label: 'Delivery',
        icon: <DeliveryIcon />,
        permission: 'delivery',
      },
      { href: '/admin/users/', label: 'Staff', icon: <TeamIcon />, permission: 'users' },
      { href: '/admin/log/', label: 'Change log', icon: <HistoryIcon />, permission: 'audit' },
    ],
  },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { me } = await requireStaff('admin');
  return (
    <StaffShell area="admin" groups={GROUPS} me={me}>
      {children}
    </StaffShell>
  );
}
