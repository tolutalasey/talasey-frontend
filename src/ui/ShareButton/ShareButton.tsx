'use client';

import { useState } from 'react';

interface Props {
  title: string;
  path: string;
  className?: string;
}

// Opens the phone's share sheet, or copies the link where there is none.
export function ShareButton({ title, path, className }: Props) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = new URL(path, window.location.origin).href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <button type="button" className={className} onClick={share}>
      <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
    </button>
  );
}
