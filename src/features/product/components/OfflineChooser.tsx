'use client';

import { useRef, useState, type ReactNode } from 'react';
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
  // The same calculator as buying, for products sold by the area they cover.
  calculator?: ReactNode;
  // What one of the product is called, like pack or board.
  unit?: { one: string; many: string };
}

const valueOf = (area: HTMLElement | null, name: string) =>
  area?.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value.trim() ?? '';

// "3 packs for 12 m²" from the quantity and calculator on the page.
function amountFrom(area: HTMLElement | null, unit: { one: string; many: string }) {
  const quantity = Number(valueOf(area, 'quantity'));
  const covers = Number(valueOf(area, 'area'));
  if (!(quantity > 0)) return null;
  const count = `${quantity} ${quantity === 1 ? unit.one : unit.many}`;
  return covers > 0 ? `${count} for ${covers} m²` : count;
}

// For a product that isn't sold online: the same choices as buying, then Find a stockist opens
// the stockist form over the page, which sends what the shopper chose with their details.
export function OfflineChooser({
  phone,
  form,
  formId,
  spec,
  colours,
  size,
  calculator,
  unit = { one: 'item', many: 'items' },
}: Props) {
  const { heading, text, label } = WORDING;
  const choices = useRef<HTMLDivElement>(null);
  const [colour, setColour] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const chosen = [
    spec,
    colour && `${colours?.label ?? 'colour'}: ${colour}`,
    amount && `quantity: ${amount}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className={styles.offlineChooser} ref={choices}>
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
      {calculator ?? (
        <label className={styles.offlineQuantity}>
          Quantity
          <input type="number" name="quantity" min={1} inputMode="numeric" defaultValue={1} />
        </label>
      )}
      <div className={styles.offline}>
        <h2>{heading}</h2>
        <p>{text}</p>
        <p className={styles.offlineActions}>
          <button
            type="button"
            className="button"
            onClick={() => {
              setAmount(amountFrom(choices.current, unit));
              setAsking(true);
            }}
          >
            {label}
          </button>
          <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="button-secondary">
            Call {phone}
          </a>
        </p>
      </div>
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
