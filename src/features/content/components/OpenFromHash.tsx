'use client';

import { useEffect } from 'react';

// Opens the question a link points to (…/#its-id), so a search result lands on its answer.
export function OpenFromHash() {
  useEffect(() => {
    const open = () => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
  return null;
}
