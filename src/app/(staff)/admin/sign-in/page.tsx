import type { Metadata } from 'next';
import { SignInPage } from '@/features/staff';

export const metadata: Metadata = { title: 'Sign in to the admin' };

interface Props {
  searchParams: Promise<{ next?: string; error?: string; step?: string }>;
}

export default async function AdminSignIn({ searchParams }: Props) {
  const { next, error, step } = await searchParams;
  return <SignInPage area="admin" title="Talasey admin" next={next} error={error} step={step} />;
}
