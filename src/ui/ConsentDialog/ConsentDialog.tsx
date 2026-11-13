'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './ConsentDialog.module.css';

export interface ConsentCategory {
  id: string;
  label: string;
  description: string;
}

export type ConsentChoices = Record<string, boolean>;

export interface ConsentDialogProps {
  // Undefined until the page knows (while hydrating), so the server-rendered state is kept.
  isOpen: boolean | undefined;
  categories: ConsentCategory[];
  choices?: ConsentChoices;
  intro: ReactNode;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: (choices: ConsentChoices) => void;
}

const all = (categories: ConsentCategory[], value: boolean): ConsentChoices =>
  Object.fromEntries(categories.map((category) => [category.id, value]));

// The rest of the page while the dialog is open: unreachable by keyboard and screen readers.
const pageOutside = (overlay: HTMLElement) =>
  [...document.body.children].filter(
    (element): element is HTMLElement => element instanceof HTMLElement && element !== overlay,
  );

// Always in the HTML, and shown by CSS while <html data-consent="ask"> (set by a script before
// the first paint, or by isOpen once the page is running), so it paints with the page rather
// than after the JavaScript loads. Accept all and Reject all are the same size and style, as the
// ICO expects, and it can't be dismissed without a choice, so no tags load before one is made.
export function ConsentDialog({
  isOpen,
  categories,
  choices,
  intro,
  onAcceptAll,
  onRejectAll,
  onSave,
}: ConsentDialogProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [showPreferences, setShowPreferences] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(choices ?? all(categories, false));

  useEffect(() => {
    const element = overlay.current;
    if (!element) return;
    const root = document.documentElement;
    if (isOpen === undefined) return;
    if (!isOpen) {
      delete root.dataset.consent;
      return;
    }
    root.dataset.consent = 'ask';
    const outside = pageOutside(element);
    outside.forEach((part) => part.setAttribute('inert', ''));
    element.querySelector<HTMLButtonElement>('button')?.focus();
    return () => outside.forEach((part) => part.removeAttribute('inert'));
  }, [isOpen]);

  const actions = showPreferences ? (
    <>
      <button type="button" className={styles.primary} onClick={() => onSave(draft)}>
        Save my choices
      </button>
      <button type="button" className={styles.secondary} onClick={() => setShowPreferences(false)}>
        Back
      </button>
    </>
  ) : (
    <>
      <button type="button" className={`${styles.primary} ${styles.equal}`} onClick={onAcceptAll}>
        Accept all
      </button>
      <button type="button" className={`${styles.primary} ${styles.equal}`} onClick={onRejectAll}>
        Reject all
      </button>
      <button type="button" className={styles.secondary} onClick={() => setShowPreferences(true)}>
        Preferences
      </button>
    </>
  );

  return (
    <div ref={overlay} className={styles.overlay} data-open={isOpen || undefined}>
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.dialog}>
        <h2 id={titleId} className={styles.title}>
          {showPreferences ? 'Cookie preferences' : 'Cookies on Talasey'}
        </h2>
        <div className={styles.content}>
          {showPreferences ? (
            <>
              <p className={styles.essential}>
                Essential cookies keep the basket and checkout working. They are always on.
              </p>
              {categories.map((category) => (
                <label key={category.id} className={styles.choice}>
                  <input
                    type="checkbox"
                    checked={draft[category.id] ?? false}
                    onChange={(event) =>
                      setDraft({ ...draft, [category.id]: event.target.checked })
                    }
                  />
                  <span>
                    <span className={styles.label}>{category.label}</span>
                    <span className={styles.description}>{category.description}</span>
                  </span>
                </label>
              ))}
            </>
          ) : (
            intro
          )}
          <div className={styles.actions}>{actions}</div>
        </div>
      </div>
    </div>
  );
}
