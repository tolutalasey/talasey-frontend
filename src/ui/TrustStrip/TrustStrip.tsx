import { ChatIcon, RulerIcon, SamplesIcon, TruckIcon } from '../icons';
import styles from './TrustStrip.module.css';

const ICONS = { truck: TruckIcon, samples: SamplesIcon, ruler: RulerIcon, chat: ChatIcon };

export interface TrustPoint {
  icon: keyof typeof ICONS;
  title: string;
  text: string;
}

// The reasons to buy here, laid out like the "Why choose a Talasey pergola" brochure page.
export function TrustStrip({ points, label }: { points: readonly TrustPoint[]; label: string }) {
  return (
    <section className={styles.strip} aria-label={label}>
      <ul className={`container ${styles.list}`}>
        {points.map(({ icon, title, text }) => {
          const Icon = ICONS[icon];
          return (
            <li key={title} className={styles.item}>
              <span className={styles.ring}>
                <Icon width={28} height={28} strokeWidth={1.25} />
              </span>
              <strong className={styles.title}>{title}</strong>
              <span className={styles.text}>{text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
