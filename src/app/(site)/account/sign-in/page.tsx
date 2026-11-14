import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ContinueSignIn } from '@/features/account';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } };

export const instant = false;

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const token = (await searchParams).token;
  if (typeof token !== 'string' || token.length < 20) redirect('/account/');
  return <ContinueSignIn token={token} />;
}
