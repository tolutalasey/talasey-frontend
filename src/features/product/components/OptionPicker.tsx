import NextLink from 'next/link';
import type { OptionGroup } from '../selection';
import styles from './ProductPage.module.css';

// Each option value is a link to the page with that option chosen, so choosing works without
// JavaScript and every combination has its own (noindex) URL.
export function OptionPicker({ groups, path }: { groups: OptionGroup[]; path: string }) {
  return (
    <div className={styles.pickers}>
      {groups.map((group) => (
        <div key={group.title} role="group" aria-labelledby={`option-${group.title}`}>
          <p id={`option-${group.title}`} className={styles.pickerLabel}>
            {group.title}: <span className={styles.chosen}>{group.current ?? 'choose one'}</span>
          </p>
          <ul className={styles.choices}>
            {group.choices.map((choice) => (
              <li key={choice.value}>
                <NextLink
                  href={`${path}?${new URLSearchParams(choice.params)}`}
                  replace
                  scroll={false}
                  aria-current={choice.current ? 'true' : undefined}
                  className={
                    choice.available ? styles.choice : `${styles.choice} ${styles.unavailable}`
                  }
                >
                  {choice.value}
                  {!choice.available && (
                    <span className={styles.note}> (not with these options)</span>
                  )}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
