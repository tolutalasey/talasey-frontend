'use client';

import NextLink from 'next/link';
import { Button, Dialog, DialogTrigger, Heading, Popover } from 'react-aria-components';
import { PencilIcon, TrashIcon } from './icons';
import styles from './RowActions.module.css';

interface Props {
  name: string;
  editHref: string;
  remove: (form: FormData) => Promise<void>;
  fields: Record<string, string>;
  // What happens after the delete, in a few words.
  afterDelete?: string;
}

// Edit and Delete at the end of a list row. Delete asks once more before it goes ahead.
export function RowActions({
  name,
  editHref,
  remove,
  fields,
  afterDelete = 'You can bring it back from the change log.',
}: Props) {
  return (
    <span className={styles.actions}>
      <NextLink href={editHref} className={styles.icon} aria-label={`Edit ${name}`}>
        <PencilIcon />
      </NextLink>
      <DialogTrigger>
        <Button className={`${styles.icon} ${styles.danger}`} aria-label={`Delete ${name}`}>
          <TrashIcon />
        </Button>
        <Popover placement="bottom end" className={styles.popover}>
          <Dialog className={styles.dialog}>
            {({ close }) => (
              <form action={remove}>
                {Object.entries(fields).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={value} />
                ))}
                <Heading slot="title" className={styles.title}>
                  Delete {name}?
                </Heading>
                <p className={styles.text}>{afterDelete}</p>
                <div className={styles.buttons}>
                  <Button className={styles.cancel} onPress={close}>
                    Cancel
                  </Button>
                  <button type="submit" className={styles.confirm}>
                    <TrashIcon />
                    Delete
                  </button>
                </div>
              </form>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
    </span>
  );
}
