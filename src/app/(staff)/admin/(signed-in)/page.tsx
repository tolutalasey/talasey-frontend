import type { Metadata } from 'next';
import NextLink from 'next/link';
import { requireStaff, staffStyles as styles } from '@/features/staff';

export const metadata: Metadata = { title: 'Admin' };

const AREAS = [
  {
    href: '/admin/products/',
    title: 'Products',
    text: 'Names, prices, photos, stock and options.',
    permission: 'catalogue',
  },
  {
    href: '/admin/orders/',
    title: 'Orders',
    text: 'New orders, delivery days and refunds.',
    permission: 'orders',
  },
  {
    href: '/admin/delivery/',
    title: 'Delivery',
    text: 'Postcode areas, prices and pallet days.',
    permission: 'delivery',
  },
  {
    href: '/admin/colour-sets/',
    title: 'Colour sets',
    text: 'The colours offered on 1B products.',
    permission: 'catalogue',
  },
  {
    href: '/admin/log/',
    title: 'Change log',
    text: 'Every change, and undo for any of them.',
    permission: 'audit',
  },
  {
    href: '/content/',
    title: 'Content',
    text: 'Pages, guides, FAQs and the homepage.',
    permission: 'content.edit',
  },
] as const;

export default async function AdminHome() {
  const { me } = await requireStaff('admin');
  return (
    <>
      <h1>Hello, {me.name.split(' ')[0]}</h1>
      <div className={styles.grid}>
        {AREAS.filter((area) => me.permissions.includes(area.permission)).map((area) => (
          <section key={area.href} className={styles.panel}>
            <h2>
              <NextLink href={area.href}>{area.title}</NextLink>
            </h2>
            <p>{area.text}</p>
          </section>
        ))}
      </div>
    </>
  );
}
