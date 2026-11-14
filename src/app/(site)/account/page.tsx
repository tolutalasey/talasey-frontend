import type { Metadata } from 'next';
import { AccountPage, getAccount, SignInPage } from '@/features/account';
import { readFeedback } from '@/lib/form-feedback.server';

export const metadata: Metadata = { title: 'Your account', robots: { index: false } };

// Reads the visitor's cookie, so it renders per request and works without JavaScript.
export const instant = false;

const EXPIRED = 'That link has expired or was used already. Ask for a new one below.';

export default async function Account({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [account, feedback, params] = await Promise.all([
    getAccount(),
    readFeedback(),
    searchParams,
  ]);
  if (account) return <AccountPage account={account} />;
  const expired = params.link === 'expired' ? { message: EXPIRED } : undefined;
  return <SignInPage feedback={feedback.account ?? expired} />;
}
