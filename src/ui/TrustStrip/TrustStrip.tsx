import { ChatIcon, RulerIcon, SamplesIcon, TruckIcon } from '../icons';
import styles from './TrustStrip.module.css';

const ICONS = { truck: TruckIcon, samples: SamplesIcon, ruler: RulerIcon, chat: ChatIcon };

export interface TrustPoint {
  icon: keyof typeof ICONS;
  title: string;
  text: string;
  href?: string;
}

// The reasons to buy here, laid out like the "Why choose a Talasey pergola" brochure page.
export function TrustStrip({ points, label }: { points: readonly TrustPoint[]; label: string }) {
  return (
    <section className={styles.strip} aria-label={label}>
      <ul className={styles.list}>
        {points.map(({ icon, title, text, href }) => {
          const Icon = ICONS[icon];
          return (
            <li key={title} className={styles.item}>
              <span className={styles.ring}>
                <Icon width={22} height={22} strokeWidth={1.5} />
              </span>
              <strong className={styles.title}>
                {href ? (
                  <a href={href} className={styles.link}>
                    {title}
                  </a>
                ) : (
                  title
                )}
              </strong>
              <span className={styles.text}>{text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
