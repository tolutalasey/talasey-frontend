import { Button } from '@/ui/Button/Button';
import { TextAreaField } from '@/ui/TextAreaField/TextAreaField';
import { TextField } from '@/ui/TextField/TextField';
import { staffStyles as styles } from '@/features/staff';
import { deleteColourSet, saveColourSet } from '../actions';
import type { ColourSet } from '../types';

// Colours are one per line, "Name, #hex", so a set can be typed or pasted from the sheet.
export function ColourSetEditor({ set }: { set?: ColourSet }) {
  return (
    <>
      <form action={saveColourSet} className={`${styles.panel} ${styles.stack}`}>
        {set && <input type="hidden" name="id" value={set.id} />}
        {set?.colours.map((colour) => (
          <input
            key={colour.id}
            type="hidden"
            name={`colourId:${colour.name.toLowerCase()}`}
            value={colour.id}
          />
        ))}
        <TextField label="Name" name="name" defaultValue={set?.name} isRequired />
        <TextAreaField
          label="Colours"
          name="colours"
          rows={8}
          defaultValue={set?.colours.map((colour) => `${colour.name}, ${colour.hex}`).join('\n')}
          description="One per line: the name, a comma, then the screen colour, like: Jet black (RAL 9005), #0A0A0A"
        />
        <div className={styles.actions}>
          <Button type="submit">{set ? 'Save' : 'Add colour set'}</Button>
        </div>
      </form>
      {set && (
        <form action={deleteColourSet} className={styles.row}>
          <input type="hidden" name="id" value={set.id} />
          <p className={styles.muted}>
            {set.usedBy > 0
              ? `${set.usedBy} products use this set, so it can't be deleted.`
              : 'No products use this set.'}
          </p>
          {set.usedBy === 0 && (
            <Button type="submit" variant="secondary">
              Delete colour set
            </Button>
          )}
        </form>
      )}
    </>
  );
}
