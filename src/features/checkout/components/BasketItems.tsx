import NextLink from 'next/link';
import type { BasketLine } from '@/api-client';
import { formatPrice } from '@/lib/format';
import { productPath } from '@/lib/urls/keyword-map';
import { MinusIcon, PlusIcon } from '@/ui/icons';
import { VisuallyHidden } from '@/ui/VisuallyHidden/VisuallyHidden';
import { changeLine } from '../actions';
import styles from './BasketItems.module.css';

interface Props {
  lines: BasketLine[];
  stock: Record<string, string>;
  pictures: Record<string, { src: string; alt: string }>;
}

// Lines the basket can add back exactly as they were, so Remove offers Undo.
const canPutBack = (line: BasketLine) =>
  !!line.variantId && !line.colour && !line.bespoke && !line.buildId;

function QuantityButton({
  line,
  to,
  label,
  children,
}: {
  line: BasketLine;
  to: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <form action={changeLine}>
      <input type="hidden" name="lineId" value={line.id} />
      <input type="hidden" name="quantity" value={to} />
      <input type="hidden" name="title" value={line.title} />
      {to === 0 && canPutBack(line) && (
        <>
          <input type="hidden" name="undo" value={line.variantId ?? ''} />
          <input type="hidden" name="was" value={line.quantity} />
        </>
      )}
      <button type="submit" className={styles.step} aria-label={label}>
        {children}
      </button>
    </form>
  );
}

export function BasketItems({ lines, stock, pictures }: Props) {
  return (
    <ul className={styles.items} aria-label="Items in your basket">
      {lines.map((line) => {
        const picture = line.handle ? pictures[line.handle] : undefined;
        const fixed = !!line.buildId || line.bespoke;
        return (
          <li key={line.id} className={styles.item}>
            <div className={styles.picture}>
              {picture ? (
                <img src={picture.src} alt={picture.alt} width={96} height={96} loading="lazy" />
              ) : (
                <span className={styles.blank} aria-hidden="true" />
              )}
            </div>
            <div className={styles.about}>
              <h2 className={styles.title}>
                {line.handle ? (
                  <NextLink href={productPath(line.handle)}>{line.title}</NextLink>
                ) : (
                  line.title
                )}
              </h2>
              <p className={styles.details}>
                {[line.variantTitle, line.colour, line.bespoke && 'Made to measure']
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {stock[line.id] && <p className={styles.stock}>{stock[line.id]}</p>}
              <p className={styles.unit}>{formatPrice(line.unitPrice)} each</p>
            </div>
            <div className={styles.controls}>
              {fixed ? (
                <p className={styles.count}>Qty {line.quantity}</p>
              ) : (
                <div
                  className={styles.quantity}
                  role="group"
                  aria-label={`Quantity of ${line.title}`}
                >
                  <QuantityButton
                    line={line}
                    to={line.quantity - 1}
                    label={line.quantity === 1 ? `Remove ${line.title}` : `One fewer ${line.title}`}
                  >
                    <MinusIcon />
                  </QuantityButton>
                  <output className={styles.value} aria-live="polite">
                    {line.quantity}
                  </output>
                  <QuantityButton
                    line={line}
                    to={line.quantity + 1}
                    label={`One more ${line.title}`}
                  >
                    <PlusIcon />
                  </QuantityButton>
                </div>
              )}
              <form action={changeLine}>
                <input type="hidden" name="lineId" value={line.id} />
                <input type="hidden" name="quantity" value={0} />
                <input type="hidden" name="title" value={line.title} />
                {canPutBack(line) && (
                  <>
                    <input type="hidden" name="undo" value={line.variantId ?? ''} />
                    <input type="hidden" name="was" value={line.quantity} />
                  </>
                )}
                <button type="submit" className={styles.remove}>
                  Remove<VisuallyHidden> {line.title}</VisuallyHidden>
                </button>
              </form>
            </div>
            <p className={styles.total}>{formatPrice(line.total)}</p>
          </li>
        );
      })}
    </ul>
  );
}
