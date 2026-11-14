'use client';

import { useEffect } from 'react';

// After the server sends a form back with problems, move focus to the first field to fix, so
// keyboard and screen reader users land on it instead of at the top of the page.
export function useFocusFirstError(formId: string, errors: object | undefined) {
  useEffect(() => {
    if (!errors || Object.keys(errors).length === 0) return;
    document
      .querySelector<HTMLElement>(`#${formId} [aria-invalid="true"]`)
      ?.focus({ preventScroll: false });
  }, [formId, errors]);
}
