'use client';

import { Button as AriaButton, Disclosure, DisclosurePanel, Heading } from 'react-aria-components';
import { Button } from '../Button/Button';
import { Checkbox, CheckboxGroup } from '../Checkbox/Checkbox';
import { ChevronIcon } from '../icons';
import styles from './FilterPanel.module.css';

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export type FilterValues = Record<string, string[]>;

export interface FilterPanelProps {
  groups: FilterGroup[];
  value: FilterValues;
  resultCount: number;
  onChange: (value: FilterValues) => void;
  onClear: () => void;
}

const results = (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`;

// Filters apply as soon as they change; the result count is announced so screen reader users
// hear the effect without leaving the panel.
export function FilterPanel({ groups, value, resultCount, onChange, onClear }: FilterPanelProps) {
  const active = Object.values(value).flat().length;

  return (
    <section aria-labelledby="filters-title" className={styles.panel}>
      <div className={styles.header}>
        <h2 id="filters-title" className={styles.title}>
          Filter
        </h2>
        <p role="status" className={styles.count}>
          {results(resultCount)}
        </p>
      </div>
      {groups.map((group) => (
        <Disclosure key={group.id} defaultExpanded className={styles.group}>
          <Heading level={3} className={styles.groupHeading}>
            <AriaButton slot="trigger" className={styles.trigger}>
              {group.label}
              <ChevronIcon className={styles.chevron} />
            </AriaButton>
          </Heading>
          <DisclosurePanel>
            <CheckboxGroup
              label={group.label}
              isLabelHidden
              value={value[group.id] ?? []}
              onChange={(selected) => onChange({ ...value, [group.id]: selected })}
            >
              {group.options.map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label} <span className={styles.optionCount}>({option.count})</span>
                </Checkbox>
              ))}
            </CheckboxGroup>
          </DisclosurePanel>
        </Disclosure>
      ))}
      <Button variant="secondary" isDisabled={active === 0} onPress={onClear}>
        Clear filters
      </Button>
    </section>
  );
}
