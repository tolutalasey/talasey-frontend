'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { listingTarget, type CuratedTarget, type FilterValues } from '@/lib/listing-href';

const NOT_FILTERS = new Set(['sort', 'q']);

function stateOf(form: HTMLFormElement) {
  const filters: FilterValues = {};
  let sort: string | undefined;
  const extra = new URLSearchParams();
  for (const [name, value] of new FormData(form)) {
    if (typeof value !== 'string' || value === '') continue;
    if (name === 'sort') sort = value;
    else if (NOT_FILTERS.has(name)) extra.set(name, value);
    else filters[name] = [...(filters[name] ?? []), value];
  }
  return { filters, sort, extra };
}

// Applies the filter form as soon as a box is ticked or the sort changes, going straight to the
// one URL for that filter state, and hides the submit button that only matters without JavaScript.
export function ApplyOnChange({ formId, curated }: { formId: string; curated: CuratedTarget[] }) {
  const router = useRouter();

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) return;
    form.dataset.applyOnChange = 'true';

    const apply = () => {
      const { filters, sort, extra } = stateOf(form);
      const href = listingTarget(form.getAttribute('action') ?? '', { filters, sort }, curated);
      const more = extra.toString();
      router.push(more ? `${href}${href.includes('?') ? '&' : '?'}${more}` : href, {
        scroll: false,
      });
    };

    form.addEventListener('change', apply);
    return () => {
      form.removeEventListener('change', apply);
      delete form.dataset.applyOnChange;
    };
  }, [formId, curated, router]);

  return null;
}
