'use client';

import { SearchField, type Suggestion as FieldSuggestion } from '@/ui/SearchField/SearchField';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Suggestion } from '../product-search';

const DELAY_MS = 150;

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

const toField = (suggestion: Suggestion): FieldSuggestion => ({
  id: suggestion.handle,
  label: suggestion.title,
  hint: suggestion.priceFrom === null ? undefined : `From ${gbp.format(suggestion.priceFrom)}`,
});

// Suggestions as the shopper types; Enter goes to the full results. Without JavaScript the
// field is a plain GET form to /search/.
export function HeaderSearch({
  defaultQuery = '',
  autoFocus,
}: {
  defaultQuery?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef<AbortController>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const lookUp = (query: string) => {
    clearTimeout(timer.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    timer.current = setTimeout(async () => {
      latest.current?.abort();
      const controller = new AbortController();
      latest.current = controller;
      try {
        const response = await fetch(`/api/search/?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (response.ok) setSuggestions(((await response.json()) as Suggestion[]).map(toField));
      } catch {
        // A newer query replaced this one, or the network dropped: keep what is shown.
      }
    }, DELAY_MS);
  };

  return (
    <SearchField
      label="Search products"
      action="/search/"
      defaultQuery={defaultQuery}
      autoFocus={autoFocus}
      suggestions={suggestions}
      onInputChange={lookUp}
      onSelect={(suggestion) => router.push(`/products/${suggestion.id}/`)}
      onSubmit={(query) => router.push(`/search/?q=${encodeURIComponent(query)}`)}
    />
  );
}
