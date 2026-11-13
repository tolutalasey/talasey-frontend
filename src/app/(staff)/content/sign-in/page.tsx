import type { Metadata } from 'next';
import { SignInPage } from '@/features/staff';

export const metadata: Metadata = { title: 'Sign in to edit content' };

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function ContentSignIn({ searchParams }: Props) {
  const { next, error } = await searchParams;
  return <SignInPage area="content" title="Talasey content" next={next} error={error} />;
}
