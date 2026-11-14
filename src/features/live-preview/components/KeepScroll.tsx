'use client';

import { useEffect } from 'react';

// The preview reloads after each pause in typing; this puts it back where the editor was looking.
export function KeepScroll({ id }: { id: string }) {
  useEffect(() => {
    const key = `preview-scroll:${id}`;
    const read = () => {
      try {
        return Number(sessionStorage.getItem(key) ?? 0);
      } catch {
        return 0;
      }
    };
    window.scrollTo(0, read());
    const save = () => {
      try {
        sessionStorage.setItem(key, String(window.scrollY));
      } catch {
        // Storage can be blocked; the preview then opens at the top.
      }
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [id]);
  return null;
}
