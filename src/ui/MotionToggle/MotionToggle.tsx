import { PauseIcon, PlayIcon } from '../icons';
import styles from './MotionToggle.module.css';

export interface MotionToggleProps {
  // What moves, for the accessible name: "Pause the photos", "Pause the gardens".
  label: string;
  tone?: 'light' | 'dark';
  className?: string;
}

// A checkbox, so it works without JavaScript. Ticking it stops every animation inside the nearest
// element marked data-motion (see globals.css).
export function MotionToggle({ label, tone = 'light', className }: MotionToggleProps) {
  return (
    <label className={`${styles.toggle} ${styles[tone]} ${className ?? ''}`}>
      <input type="checkbox" className={styles.input} data-motion-pause="" aria-label={label} />
      <PauseIcon className={styles.pause} width={18} height={18} />
      <PlayIcon className={styles.play} width={18} height={18} />
    </label>
  );
}
