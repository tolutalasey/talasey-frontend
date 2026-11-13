'use client';

import { OPEN_COOKIE_SETTINGS } from './ConsentManager';
import styles from './CookieSettingsButton.module.css';

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}
    >
      Cookie settings
    </button>
  );
}
