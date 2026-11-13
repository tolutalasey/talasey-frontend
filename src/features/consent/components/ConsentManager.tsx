'use client';

import { fullConsent, needsAsking, noConsent, recordConsent, type ConsentState } from '@/analytics';
import { ConsentDialog } from '@/ui';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { readConsentCookie, saveConsent, subscribeToConsent } from '../consent-cookie';
import { updateConsentMode } from '../consent-mode';

export const OPEN_COOKIE_SETTINGS = 'talasey:cookie-settings';

const categories = [
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Counts visits and how pages are used, so we can make them better.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Measures our ads on Google, Meta, Pinterest and TikTok, and tailors them to you.',
  },
];

const noSubscription = () => () => undefined;

// The server always renders the dialog closed: without JavaScript nothing is tracked, and a
// dialog that can't be answered would block the page.
export function ConsentManager({ secureCookie }: { secureCookie: boolean }) {
  const inBrowser = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const cookies = useSyncExternalStore(
    subscribeToConsent,
    () => document.cookie,
    () => '',
  );
  const [reopened, setReopened] = useState(false);
  const record = inBrowser ? readConsentCookie(cookies) : null;

  useEffect(() => {
    const stored = readConsentCookie();
    if (stored) updateConsentMode(stored.choices);
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, reopen);
  }, []);

  function decide(choices: ConsentState) {
    saveConsent(recordConsent(choices), secureCookie);
    updateConsentMode(choices);
    setReopened(false);
  }

  const open = inBrowser && (reopened || needsAsking(record));

  // Keyed on open, so each opening starts from the current choices on the first screen.
  return (
    <ConsentDialog
      key={String(open)}
      isOpen={open}
      categories={categories}
      choices={record?.choices ?? noConsent}
      intro={
        <p>
          We use cookies to see how the site is used and to measure our ads. Nothing is set until
          you choose. You can change your mind at any time from Cookie settings at the bottom of
          every page.
        </p>
      }
      onAcceptAll={() => decide(fullConsent)}
      onRejectAll={() => decide(noConsent)}
      onSave={(saved) => decide({ analytics: !!saved.analytics, marketing: !!saved.marketing })}
    />
  );
}
