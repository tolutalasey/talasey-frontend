'use client';

import { useState } from 'react';
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
} from 'react-aria-components';
import { SearchIcon } from '../icons';
import styles from './SearchField.module.css';

export interface Suggestion {
  id: string;
  label: string;
  hint?: string;
}

export interface SearchFieldProps {
  label?: string;
  suggestions: Suggestion[];
  onInputChange: (query: string) => void;
  onSelect: (suggestion: Suggestion) => void;
  onSubmit: (query: string) => void;
  defaultQuery?: string;
  // Where the form goes without JavaScript, as a GET with the query in `name`.
  action?: string;
  name?: string;
  autoFocus?: boolean;
}

// Suggestions come from the parent as the shopper types, often a moment later from the server, so
// the list opens while empty and stays hidden until there is something in it. Enter with no
// suggestion highlighted searches for what was typed.
export function SearchField({
  label = 'Search products and guides',
  suggestions,
  onInputChange,
  onSelect,
  onSubmit,
  defaultQuery = '',
  action,
  name = 'q',
  autoFocus,
}: SearchFieldProps) {
  const [query, setQuery] = useState(defaultQuery);
  const submit = () => {
    if (query.trim()) onSubmit(query.trim());
  };

  return (
    <form
      role="search"
      action={action}
      method="get"
      className={styles.search}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <ComboBox
        items={suggestions}
        inputValue={query}
        onInputChange={(value) => {
          setQuery(value);
          onInputChange(value);
        }}
        onSelectionChange={(key) => {
          const chosen = suggestions.find((suggestion) => suggestion.id === key);
          if (chosen) onSelect(chosen);
        }}
        allowsCustomValue
        allowsEmptyCollection
        autoFocus={autoFocus}
        menuTrigger="input"
        className={styles.combo}
      >
        <Label className={styles.label}>{label}</Label>
        <div className={styles.box}>
          <Input
            name={name}
            className={styles.input}
            placeholder="Paving, decking, planters…"
            onKeyDown={(event) => {
              // The list is open while suggestions load; Enter with none highlighted still searches.
              if (
                event.key !== 'Enter' ||
                event.currentTarget.getAttribute('aria-activedescendant')
              ) {
                return;
              }
              event.preventDefault();
              submit();
            }}
          />
          <Button type="submit" className={styles.submit} aria-label="Search">
            <SearchIcon />
          </Button>
        </div>
        <Popover className={styles.popover} offset={4}>
          <ListBox className={styles.list}>
            {(suggestion: Suggestion) => (
              <ListBoxItem id={suggestion.id} textValue={suggestion.label} className={styles.item}>
                <Text slot="label">{suggestion.label}</Text>
                {suggestion.hint && (
                  <Text slot="description" className={styles.hint}>
                    {suggestion.hint}
                  </Text>
                )}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </ComboBox>
    </form>
  );
}
