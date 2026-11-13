'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronIcon } from '../icons';
import styles from './MegaMenu.module.css';

export interface MenuLink {
  label: string;
  href: string;
}

export interface MenuColumn {
  heading: string;
  links: MenuLink[];
}

export interface MenuSection {
  id: string;
  label: string;
  href: string;
  columns: MenuColumn[];
}

export interface MegaMenuProps {
  sections: MenuSection[];
  label?: string;
}

// Disclosure navigation with top-level links: each section name is a real link (so the menu works
// before JavaScript loads) with a button beside it that opens its panel. Escape or a click outside
// closes the open panel.
export function MegaMenu({ sections, label = 'Main' }: MegaMenuProps) {
  const id = useId();
  const nav = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const buttonId = (section: string) => `${id}-${section}-button`;
  const panelId = (section: string) => `${id}-${section}-panel`;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !open) return;
    document.getElementById(buttonId(open))?.focus();
    setOpen(null);
  }

  return (
    <nav ref={nav} aria-label={label} className={styles.nav} onKeyDown={closeOnEscape}>
      <ul className={styles.sections}>
        {sections.map((section) => {
          const expanded = open === section.id;
          return (
            <li key={section.id} className={styles.section}>
              <a className={styles.top} href={section.href}>
                {section.label}
              </a>
              <button
                id={buttonId(section.id)}
                type="button"
                className={styles.toggle}
                aria-expanded={expanded}
                aria-controls={panelId(section.id)}
                aria-label={`${section.label} menu`}
                onClick={() => setOpen(expanded ? null : section.id)}
              >
                <ChevronIcon />
              </button>
              <div id={panelId(section.id)} className={styles.panel} hidden={!expanded}>
                {section.columns.map((column) => (
                  <div key={column.heading} className={styles.column}>
                    <p id={`${panelId(section.id)}-${column.heading}`} className={styles.heading}>
                      {column.heading}
                    </p>
                    <ul
                      aria-labelledby={`${panelId(section.id)}-${column.heading}`}
                      className={styles.links}
                    >
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <a href={link.href}>{link.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
