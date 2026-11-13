'use client';

import { useState } from 'react';
import { Button } from '../Button/Button';
import { Checkbox, CheckboxGroup } from '../Checkbox/Checkbox';
import styles from './CompleteTheJob.module.css';

export interface JobItem {
  id: string;
  name: string;
  // Why it's suggested, worked out for this project: "About 3 bags for 18 m²".
  reason: string;
  price: string;
}

export interface CompleteTheJobProps {
  label: string;
  items: JobItem[];
  defaultSelected?: string[];
  onAdd: (ids: string[]) => void;
}

export function CompleteTheJob({ label, items, defaultSelected = [], onAdd }: CompleteTheJobProps) {
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <div className={styles.job}>
      <CheckboxGroup label={label} value={selected} onChange={setSelected}>
        {items.map((item) => (
          <Checkbox key={item.id} value={item.id} description={item.reason}>
            <span className={styles.row}>
              <span>{item.name}</span>
              <span className={styles.price}>{item.price}</span>
            </span>
          </Checkbox>
        ))}
      </CheckboxGroup>
      <div>
        <Button
          variant="secondary"
          isDisabled={selected.length === 0}
          onPress={() => onAdd(selected)}
        >
          {selected.length === 0
            ? 'Add to basket'
            : `Add ${selected.length} ${selected.length === 1 ? 'item' : 'items'} to basket`}
        </Button>
      </div>
    </div>
  );
}
