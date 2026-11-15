'use client';

import {
  canMixSlats,
  lightingIncluded,
  optionsFor,
  panelCount,
  partsForSide,
  sidesOf,
  sizeOf,
  type Catalogue,
  type Fixing,
  type PergolaRules,
  type SideOption,
} from '../rules';
import { BuildDrawing } from './BuildDrawing';
import { BiggerSize, type OtherBuilder } from './BiggerSize';
import { BuildSummary } from './BuildSummary';
import { pounds, usePergolaBuild } from './usePergolaBuild';
import styles from './AmyBuilder.module.css';

interface Props {
  rules: PergolaRules;
  catalogue: Catalogue;
  others: OtherBuilder[];
}

const FIXINGS: { id: Fixing; label: string }[] = [
  { id: 'free-standing', label: 'Free-standing' },
  { id: 'wall-mounted', label: 'Wall-mounted' },
];

function Step({
  number,
  title,
  required,
  locked = false,
  children,
}: {
  number: number;
  title: string;
  required: boolean;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={styles.step} disabled={locked} data-locked={locked || undefined}>
      <legend className={styles.stepTitle}>
        <span className={styles.stepNumber}>{number}</span>
        {title}
        <span className={styles.tag}>{required ? 'Required' : 'Optional'}</span>
      </legend>
      {children}
    </fieldset>
  );
}

const sidePrice = (catalogue: Catalogue, option: SideOption, length: number) =>
  (partsForSide(option, length) ?? []).reduce(
    (sum, part) => sum + (catalogue[part.sku]?.pricePence ?? 0) * part.quantity,
    0,
  );

// Amy's design: the steps from her product page spec, tab 4, with the drawing beside them.
export function AmyBuilder({ rules, catalogue, others }: Props) {
  const { build, summary, change, chooseSide, chooseSlat, addToBag, pending, message } =
    usePergolaBuild(rules, catalogue);
  const size = sizeOf(rules, build);
  const ready = Boolean(size && build.fixing);
  const lightingKit = size?.lightingKitSku ? catalogue[size.lightingKitSku] : undefined;
  const heater = rules.heaterSku ? catalogue[rules.heaterSku] : undefined;
  const fromPrice = (index: number) => {
    const option = rules.sizes[index];
    const prices = [option?.freeStandingSku, option?.wallMountedSku].flatMap((sku) =>
      sku && catalogue[sku] ? [catalogue[sku].pricePence] : [],
    );
    return prices.length ? Math.min(...prices) : null;
  };

  return (
    <div className={styles.builder}>
      <div className={styles.preview}>
        <div className={styles.drawing}>
          <BuildDrawing rules={rules} build={build} />
        </div>
        <div className={styles.total}>
          <span>Your pergola</span>
          <strong>
            {summary.totalPence ? pounds(summary.totalPence) : 'Choose a size and fixing'}
          </strong>
        </div>
      </div>

      <div className={styles.steps}>
        <Step number={1} title="Size" required>
          <div className={styles.chips}>
            {rules.sizes.map((option, index) => {
              const price = fromPrice(index);
              return (
                <label key={option.label} className={styles.chip}>
                  <input
                    type="radio"
                    name="size"
                    checked={build.size === index}
                    onChange={() => change({ size: index })}
                  />
                  <span>{option.label}</span>
                  {price !== null && <small>from {pounds(price)}</small>}
                </label>
              );
            })}
          </div>
          <BiggerSize rules={rules} others={others} />
        </Step>

        <Step number={2} title="Fixing" required>
          <div className={styles.chips}>
            {FIXINGS.map((fixing) => (
              <label key={fixing.id} className={styles.chip}>
                <input
                  type="radio"
                  name="fixing"
                  checked={build.fixing === fixing.id}
                  onChange={() => change({ fixing: fixing.id })}
                />
                <span>{fixing.label}</span>
                {size && (
                  <small>
                    SKU {fixing.id === 'free-standing' ? size.freeStandingSku : size.wallMountedSku}
                  </small>
                )}
              </label>
            ))}
          </div>
          {ready && (
            <p className={styles.note}>
              {build.fixing === 'wall-mounted' && 'The long back side fixes to your wall. '}
              {summary.exactSize && `Exact size: ${summary.exactSize}.`}
            </p>
          )}
        </Step>

        <Step number={3} title="Sides" required={false} locked={!ready}>
          {size &&
            sidesOf(size, build.fixing).map((side) => {
              const choice = build.sides[side.id];
              const option = rules.sides.find((candidate) => candidate.name === choice.option);
              const fits = optionsFor(rules, catalogue, side.length);
              return (
                <div key={side.id} className={styles.side}>
                  <label className={styles.sideRow}>
                    <span>
                      <strong>{side.name}</strong> {side.length} m
                    </span>
                    <select
                      value={side.onWall ? 'wall' : (choice.option ?? '')}
                      disabled={side.onWall}
                      onChange={(event) => chooseSide(side.id, event.target.value || null)}
                    >
                      {side.onWall ? (
                        <option value="wall">Fixed to the wall</option>
                      ) : (
                        <>
                          <option value="">Not required</option>
                          {fits.map((candidate) => (
                            <option key={candidate.name} value={candidate.name}>
                              {candidate.name}
                              {candidate.kind === 'Panels to mix'
                                ? ` (${panelCount(candidate, side.length)} panels)`
                                : side.length > 4
                                  ? ` (${side.length / 3} × 3 m)`
                                  : ''}
                              , {pounds(sidePrice(catalogue, candidate, side.length))}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </label>
                  {option && canMixSlats(option, side.length) && (
                    <div className={styles.slats} role="group" aria-label={`${side.name} panels`}>
                      {choice.slats.map((slat, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-pressed={slat === 'vertical'}
                          aria-label={`Panel ${index + 1}: ${slat}. Switch to ${slat === 'horizontal' ? 'vertical' : 'horizontal'}`}
                          onClick={() =>
                            chooseSlat(
                              side.id,
                              index,
                              slat === 'horizontal' ? 'vertical' : 'horizontal',
                            )
                          }
                        >
                          {slat === 'horizontal' ? 'H' : 'V'}
                        </button>
                      ))}
                      <small>Tap a panel to switch between horizontal and vertical.</small>
                    </div>
                  )}
                </div>
              );
            })}
        </Step>

        <Step number={4} title="Lighting" required={false} locked={!ready}>
          {lightingIncluded(rules) ? (
            <p className={styles.note}>LED lighting is included as standard.</p>
          ) : (
            <div className={styles.chips}>
              <label className={styles.chip}>
                <input
                  type="radio"
                  name="lighting"
                  checked={!build.lighting}
                  onChange={() => change({ lighting: false })}
                />
                <span>Not required</span>
              </label>
              {lightingKit && (
                <label className={styles.chip}>
                  <input
                    type="radio"
                    name="lighting"
                    checked={build.lighting}
                    onChange={() => change({ lighting: true })}
                  />
                  <span>RGB LED lighting kit</span>
                  <small>{pounds(lightingKit.pricePence)}, remote included</small>
                </label>
              )}
            </div>
          )}
        </Step>

        <Step number={5} title="Heating" required={false} locked={!ready}>
          {heater ? (
            <div className={styles.counter}>
              <span>3kW linear heaters, {pounds(heater.pricePence)} each</span>
              <div className={styles.stepper}>
                <button
                  type="button"
                  aria-label="One fewer heater"
                  disabled={build.heaters === 0}
                  onClick={() => change({ heaters: build.heaters - 1 })}
                >
                  −
                </button>
                <output aria-live="polite">
                  {build.heaters === 0 ? 'Not required' : build.heaters}
                </output>
                <button
                  type="button"
                  aria-label="One more heater"
                  onClick={() => change({ heaters: build.heaters + 1 })}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <p className={styles.note}>Heaters are not available yet.</p>
          )}
        </Step>

        <BuildSummary
          rules={rules}
          summary={summary}
          pending={pending}
          message={message}
          onAdd={addToBag}
        />
      </div>
    </div>
  );
}
