'use client';

import { Button } from '@/ui/Button/Button';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition, type ReactNode } from 'react';
import { formatPrice } from '@/lib/format';
import { addFenceKitToBasket } from '../actions';
import type { FenceBuilder as Rules } from '../content';
import {
  coloursFor,
  fenceHeightMm,
  fenceKit,
  MAX_LENGTH_M,
  MIN_LENGTH_M,
  offered,
  type FenceCatalogue,
  type FenceChoice,
} from '../rules';
import { FenceDrawing } from './FenceDrawing';
import styles from './FenceBuilder.module.css';

// How the board colours look on screen; a colour not listed is drawn in a neutral grey.
const SWATCHES: Record<string, string> = {
  'Black Carbon': '#2f2d2c',
  'Antique Grey': '#8c8983',
  'Brown Cedar': '#7b5236',
};
const swatch = (colour: string | null) => (colour && SWATCHES[colour]) || '#9a958f';

const pounds = (pence: number) => formatPrice({ amount: pence / 100, currencyCode: 'GBP' });
const metres = (mm: number) => `${(mm / 1000).toFixed(2)} m`;

function firstChoice(rules: Rules, catalogue: FenceCatalogue, startStyle?: number): FenceChoice {
  const available = offered(rules, catalogue);
  const style =
    startStyle !== undefined && available.styles[startStyle]
      ? startStyle
      : Math.max(available.styles.indexOf(true), 0);
  return {
    style,
    colour: coloursFor(rules, catalogue, style)[0] ?? null,
    lengthM: 10,
    boards: rules.boardCounts.at(-1) ?? 1,
    post: Math.max(available.posts.indexOf(true), 0),
    topper: null,
    extras: [],
  };
}

interface Props {
  rules: Rules;
  catalogue: FenceCatalogue;
  // On a board's product page: that board's style, the product's name above the steps and its
  // photos above the kit.
  startStyle?: number;
  head?: ReactNode;
  photos?: ReactNode;
}

// Step by step: style, colour, length, height, posts and extras, with the kit and its price
// worked out as each choice changes. Adding to the bag sends the choices, not the parts.
export function FenceBuilder({ rules, catalogue, startStyle, head, photos }: Props) {
  const router = useRouter();
  const [choice, setChoice] = useState(() => firstChoice(rules, catalogue, startStyle));
  const [lengthText, setLengthText] = useState(String(choice.lengthM));
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const available = useMemo(() => offered(rules, catalogue), [rules, catalogue]);
  const colours = coloursFor(rules, catalogue, choice.style);
  const kit = useMemo(() => fenceKit(rules, catalogue, choice), [rules, catalogue, choice]);

  const change = (update: Partial<FenceChoice>) => {
    setMessage(null);
    setChoice((current) => ({ ...current, ...update }));
  };
  const chooseStyle = (style: number) =>
    change({ style, colour: coloursFor(rules, catalogue, style)[0] ?? null });
  const typeLength = (value: string) => {
    setLengthText(value);
    const length = Number(value.replace(',', '.'));
    if (length >= MIN_LENGTH_M && length <= MAX_LENGTH_M) change({ lengthM: length });
  };
  const toggleExtra = (index: number, on: boolean) =>
    change({
      extras: on ? [...choice.extras, index] : choice.extras.filter((extra) => extra !== index),
    });

  const addToBag = () =>
    startTransition(async () => {
      const result = await addFenceKitToBasket(rules.slug, choice);
      if (result?.message) setMessage(result.message);
      if (result && 'added' in result && result.added) router.push('/basket/', { scroll: false });
    });

  const boardHeight = rules.styles[choice.style]?.boardHeight ?? 0;
  const lengthValid = Number(lengthText.replace(',', '.')) >= MIN_LENGTH_M;

  return (
    <div className={styles.builder} data-product={photos ? '' : undefined}>
      <div className={styles.steps}>
        {head}
        <fieldset className={`frame ${styles.step}`}>
          <legend>1. Style</legend>
          <div className={styles.cards}>
            {rules.styles.map((style, index) =>
              available.styles[index] ? (
                <label key={style.name} className={styles.card}>
                  <input
                    type="radio"
                    name="style"
                    checked={choice.style === index}
                    onChange={() => chooseStyle(index)}
                  />
                  <strong>{style.name}</strong>
                </label>
              ) : null,
            )}
          </div>
        </fieldset>

        {colours.length > 0 && (
          <fieldset className={`frame ${styles.step}`}>
            <legend>2. Colour</legend>
            <div className={styles.cards}>
              {colours.map((colour) => (
                <label key={colour} className={styles.card}>
                  <input
                    type="radio"
                    name="colour"
                    checked={choice.colour === colour}
                    onChange={() => change({ colour })}
                  />
                  <span className={styles.swatch} style={{ background: swatch(colour) }} />
                  <strong>{colour}</strong>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className={`frame ${styles.step}`}>
          <legend>3. Length</legend>
          <label className={styles.field}>
            <span>Length of the fence (m)</span>
            <input
              inputMode="decimal"
              value={lengthText}
              onChange={(event) => typeLength(event.target.value)}
              aria-describedby="fence-length-help"
              aria-invalid={!lengthValid || undefined}
            />
          </label>
          <p id="fence-length-help" className={styles.help}>
            Fences go up in bays of {metres(rules.bayWidth)} from post to post, so yours will be{' '}
            <strong>{metres(kit.runMm)}</strong> long in {kit.bays} bays. Between {MIN_LENGTH_M} and{' '}
            {MAX_LENGTH_M} m.
          </p>
        </fieldset>

        <fieldset className={`frame ${styles.step}`}>
          <legend>4. Height</legend>
          <div className={styles.cards}>
            {rules.boardCounts.map((boards) => (
              <label key={boards} className={styles.card}>
                <input
                  type="radio"
                  name="height"
                  checked={choice.boards === boards}
                  onChange={() => change({ boards })}
                />
                <strong>{metres(boards * boardHeight)}</strong>
                <small>{boards} boards</small>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={`frame ${styles.step}`}>
          <legend>5. Posts</legend>
          <div className={styles.cards}>
            {rules.posts.map((post, index) => {
              const tooTall = fenceHeightMm(rules, choice) > post.maxHeight;
              return available.posts[index] ? (
                <label key={post.name} className={styles.card} data-disabled={tooTall || undefined}>
                  <input
                    type="radio"
                    name="post"
                    checked={choice.post === index}
                    disabled={tooTall}
                    onChange={() => change({ post: index })}
                  />
                  <strong>{post.name}</strong>
                  <small>
                    {tooTall ? 'Too short for this height' : `Up to ${metres(post.maxHeight)}`}
                  </small>
                </label>
              ) : null;
            })}
          </div>
        </fieldset>

        {(available.toppers.some(Boolean) || available.extras.some(Boolean)) && (
          <fieldset className={`frame ${styles.step}`}>
            <legend>6. Extras</legend>
            {available.toppers.some(Boolean) && (
              <div className={styles.cards} role="radiogroup" aria-label="Trellis topper">
                <label className={styles.card}>
                  <input
                    type="radio"
                    name="topper"
                    checked={choice.topper === null}
                    onChange={() => change({ topper: null })}
                  />
                  <strong>No trellis</strong>
                </label>
                {rules.toppers.map((topper, index) =>
                  available.toppers[index] ? (
                    <label key={topper.name} className={styles.card}>
                      <input
                        type="radio"
                        name="topper"
                        checked={choice.topper === index}
                        onChange={() => change({ topper: index })}
                      />
                      <strong>{topper.name}</strong>
                      <small>Adds {metres(topper.height)}</small>
                    </label>
                  ) : null,
                )}
              </div>
            )}
            {rules.postExtras.map((extra, index) =>
              available.extras[index] ? (
                <label key={extra.name} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={choice.extras.includes(index)}
                    onChange={(event) => toggleExtra(index, event.target.checked)}
                  />
                  <span>
                    {extra.name} <small>(one per post)</small>
                  </span>
                </label>
              ) : null,
            )}
          </fieldset>
        )}
      </div>

      <aside className={`frame ${styles.summary}`} aria-labelledby="fence-kit-title">
        {photos}
        <h2 id="fence-kit-title">Your fence kit</h2>
        <FenceDrawing
          bays={kit.bays}
          boards={choice.boards}
          topper={choice.topper !== null}
          colour={swatch(choice.colour)}
        />
        <p className={styles.size}>
          {metres(kit.runMm)} long × {metres(kit.heightMm)} high · {kit.bays} bays, {kit.posts}{' '}
          posts
        </p>
        <table className={styles.parts}>
          <caption className={styles.hidden}>Parts in the kit</caption>
          <thead>
            <tr>
              <th scope="col">Part</th>
              <th scope="col">Qty</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {kit.lines.map((line) => (
              <tr key={line.variantId}>
                <th scope="row">{line.name}</th>
                <td>{line.quantity}</td>
                <td>{pounds(line.quantity * line.unitPence)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.total} aria-live="polite">
          <span>Total inc. VAT</span>
          <strong>{pounds(kit.totalPence)}</strong>
        </p>
        {kit.problems.length > 0 && (
          <ul className={styles.problems} role="status">
            {kit.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        )}
        {message && (
          <p className={styles.problems} role="alert">
            {message}
          </p>
        )}
        <Button onPress={addToBag} isPending={pending} isDisabled={!kit.ready || !lengthValid}>
          Add kit to bag
        </Button>
      </aside>
    </div>
  );
}
