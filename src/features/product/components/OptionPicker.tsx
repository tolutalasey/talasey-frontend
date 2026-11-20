import NextLink from 'next/link';
import type { OptionGroup } from '../selection';
import styles from './ProductPage.module.css';

interface Props {
  groups: OptionGroup[];
  path: string;
  // A colour with a page of its own links to that page.
  colourPaths?: Record<string, string>;
}

function hrefFor(path: string, params: Record<string, string>, colourPath?: string) {
  if (!colourPath) return `${path}?${new URLSearchParams(params)}`;
  const { colour: _colour, ...rest } = params;
  const query = new URLSearchParams(rest).toString();
  return query ? `${colourPath}?${query}` : colourPath;
}

// Each option value is a link to the page with that option chosen, so choosing works without
// JavaScript and every combination has its own (noindex) URL.
export function OptionPicker({ groups, path, colourPaths }: Props) {
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
                  href={hrefFor(
                    path,
                    choice.params,
                    group.title === 'Colour' ? colourPaths?.[choice.value] : undefined,
                  )}
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
