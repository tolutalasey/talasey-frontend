'use client';

import { useState, type ReactNode } from 'react';
import { Modal } from '@/ui/Modal/Modal';
import styles from './ProductPage.module.css';

const WORDING = {
  heading: 'Buy from a stockist',
  text: "Choose what you'd like, then tell us where you are and we'll email you the stockists nearest to you.",
  label: 'Find a stockist',
};

export interface OfflineColour {
  id: string;
  name: string;
  hex: string;
}

interface Props {
  phone: string;
  // The stockist (or installer, or showroom) form, shown once the shopper asks.
  form: ReactNode;
  // The id of that form, so the choice made here goes in with it.
  formId: string;
  // The product and the options already chosen on the page, such as "Sofia porcelain paving, Grey".
  spec: string;
  // For products with a colour choosing on the page itself, as when buying.
  colours?: { label: string; options: OfflineColour[] } | null;
  // The one size a product comes in, when it has no size to choose.
  size?: string | null;
}

// For a product that isn't sold online: the same choices as buying, then Find a stockist opens
// the stockist form over the page, which sends what the shopper chose with their details.
export function OfflineChooser({ phone, form, formId, spec, colours, size }: Props) {
  const { heading, text, label } = WORDING;
  const [colour, setColour] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const chosen = colour ? `${spec}, ${colours?.label ?? 'colour'}: ${colour}` : spec;

  return (
    <div className={styles.offline}>
      <h2>{heading}</h2>
      <p>{text}</p>
      {colours && colours.options.length > 0 && (
        <fieldset className={styles.offlineColours}>
          <legend>{colours.label.charAt(0).toUpperCase() + colours.label.slice(1)}</legend>
          <div className={styles.offlineSwatches}>
            {colours.options.map((option) => (
              <label key={option.id} className={styles.offlineSwatch}>
                <input
                  type="radio"
                  name="offline-colour"
                  value={option.name}
                  checked={colour === option.name}
                  onChange={() => setColour(option.name)}
                />
                <span style={{ backgroundColor: option.hex }} aria-hidden />
                {option.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {size && (
        <p className={styles.offlineSize}>
          Size: <strong>{size}</strong>
        </p>
      )}
      <p className={styles.offlineActions}>
        <button type="button" className="button" onClick={() => setAsking(true)}>
          {label}
        </button>
        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="button-secondary">
          Call {phone}
        </a>
      </p>
      <Modal title={heading} isOpen={asking} onOpenChange={setAsking}>
        <p className={styles.offlineChoice}>
          You chose: <strong>{chosen}</strong>
        </p>
        <input type="hidden" name="products" form={formId} value={chosen} />
        {form}
      </Modal>
    </div>
  );
}
