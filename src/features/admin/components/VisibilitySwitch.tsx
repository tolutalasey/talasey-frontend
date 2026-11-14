import { staffStyles as styles } from '@/features/staff';

interface Props {
  form: string;
  defaultChecked: boolean;
}

// Belongs to the editing form by its id, so it can sit in the side column.
export function VisibilitySwitch({ form, defaultChecked }: Props) {
  return (
    <label className={styles.switchRow}>
      <input
        type="checkbox"
        role="switch"
        name="published"
        form={form}
        defaultChecked={defaultChecked}
        className={styles.switchInput}
      />
      <span className={styles.switchTrack} aria-hidden="true" />
      <span className={styles.switchText}>
        <strong>Show on the shop</strong>
        <span className={styles.switchOn}>Shoppers can find and buy it.</span>
        <span className={styles.switchOff}>Hidden. Only staff can see it.</span>
      </span>
    </label>
  );
}
