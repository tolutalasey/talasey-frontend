import type { Metadata } from 'next';
import { SignInPage } from '@/features/staff';

export const metadata: Metadata = { title: 'Sign in to the admin' };

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function AdminSignIn({ searchParams }: Props) {
  const { next, error } = await searchParams;
  return <SignInPage area="admin" title="Talasey admin" next={next} error={error} />;
}
