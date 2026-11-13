'use client';

import type { ReactNode } from 'react';
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  type DisclosureGroupProps,
} from 'react-aria-components';
import { ChevronIcon } from '../icons';
import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps extends Pick<
  DisclosureGroupProps,
  'allowsMultipleExpanded' | 'defaultExpandedKeys'
> {
  items: AccordionItem[];
  headingLevel?: 2 | 3 | 4;
}

export function Accordion({ items, headingLevel = 3, ...props }: AccordionProps) {
  return (
    <DisclosureGroup {...props} className={styles.accordion}>
      {items.map((item) => (
        <Disclosure key={item.id} id={item.id} className={styles.item}>
          <Heading level={headingLevel} className={styles.heading}>
            <Button slot="trigger" className={styles.trigger}>
              {item.title}
              <ChevronIcon className={styles.chevron} />
            </Button>
          </Heading>
          <DisclosurePanel className={styles.panel}>{item.content}</DisclosurePanel>
        </Disclosure>
      ))}
    </DisclosureGroup>
  );
}
