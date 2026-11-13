import type { Metadata } from 'next';
import { AccountPage, requireStaff, savedTwoFactorSetup } from '@/features/staff';

export const metadata: Metadata = { title: 'Your account' };

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function Account({ searchParams }: Props) {
  const { message, error } = await searchParams;
  const { me } = await requireStaff('content');
  return (
    <AccountPage
      area="content"
      me={me}
      setup={me.twoFactor ? null : await savedTwoFactorSetup()}
      message={message}
      error={error}
    />
  );
}
