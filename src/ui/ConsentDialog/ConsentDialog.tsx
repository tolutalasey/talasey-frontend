'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Modal } from '../Modal/Modal';
import styles from './ConsentDialog.module.css';

export interface ConsentCategory {
  id: string;
  label: string;
  description: string;
}

export type ConsentChoices = Record<string, boolean>;

export interface ConsentDialogProps {
  isOpen: boolean;
  categories: ConsentCategory[];
  choices?: ConsentChoices;
  intro: ReactNode;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: (choices: ConsentChoices) => void;
}

const all = (categories: ConsentCategory[], value: boolean): ConsentChoices =>
  Object.fromEntries(categories.map((category) => [category.id, value]));

// Accept all and Reject all are the same size and style, as the ICO expects. The dialog can't be
// dismissed without a choice, so no tags load before one is made.
export function ConsentDialog({
  isOpen,
  categories,
  choices,
  intro,
  onAcceptAll,
  onRejectAll,
  onSave,
}: ConsentDialogProps) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(choices ?? all(categories, false));

  return (
    <Modal
      title={showPreferences ? 'Cookie preferences' : 'Cookies on Talasey'}
      isOpen={isOpen}
      isDismissable={false}
      isKeyboardDismissDisabled
      hideClose
    >
      {showPreferences ? (
        <div className={styles.content}>
          <p className={styles.essential}>
            Essential cookies keep the basket and checkout working. They are always on.
          </p>
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              isSelected={draft[category.id] ?? false}
              onChange={(selected) => setDraft({ ...draft, [category.id]: selected })}
              description={category.description}
            >
              {category.label}
            </Checkbox>
          ))}
          <div className={styles.actions}>
            <Button onPress={() => onSave(draft)}>Save my choices</Button>
            <Button variant="secondary" onPress={() => setShowPreferences(false)}>
              Back
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          {intro}
          <div className={styles.actions}>
            <Button className={styles.equal} onPress={onAcceptAll}>
              Accept all
            </Button>
            <Button className={styles.equal} onPress={onRejectAll}>
              Reject all
            </Button>
            <Button variant="secondary" onPress={() => setShowPreferences(true)}>
              Preferences
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
