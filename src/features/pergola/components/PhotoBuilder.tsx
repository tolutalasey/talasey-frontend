'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import {
  canMixSlats,
  lightingIncluded,
  optionsFor,
  panelCount,
  partsForSide,
  sidesOf,
  sizeOf,
  type Build,
  type Catalogue,
  type Fixing,
  type PergolaRules,
  type Side,
  type SideId,
  type SideOption,
  type Slat,
} from '../rules';
import { PHOTO_HEIGHT, PHOTO_WIDTH, sideLook, sidePhoto, wholePhoto } from '../photo-views';
import { BiggerSize, type OtherBuilder } from './BiggerSize';
import { lookOf, type SceneSide } from './PergolaScene3D';
import { pounds, usePergolaBuild } from './usePergolaBuild';
import styles from './PhotoBuilder.module.css';

interface Props {
  rules: PergolaRules;
  catalogue: Catalogue;
  others: OtherBuilder[];
  start?: Partial<Build>;
  head?: ReactNode;
}

type Step = 'structure' | 'styling' | 'addons' | 'overview';
type View = 'whole' | 'all' | 'spin' | SideId;

const PergolaScene3D = dynamic(() => import('./PergolaScene3D'), {
  ssr: false,
  loading: () => <p className={styles.sceneLoading}>Loading the 3D pergola…</p>,
});

const ignoreCanvas = () => {};

const STEPS: { id: Step; label: string }[] = [
  { id: 'structure', label: 'Structure' },
  { id: 'styling', label: 'Styling' },
  { id: 'addons', label: 'Add-ons' },
  { id: 'overview', label: 'Overview' },
];

const FIXINGS: { id: Fixing; label: string; text: string }[] = [
  { id: 'free-standing', label: 'Free-standing', text: 'Stands on its own, anywhere level.' },
  { id: 'wall-mounted', label: 'Wall-mounted', text: 'Fixed to the house along the back.' },
];

const SIDE_ORDER: SideId[] = ['front', 'back', 'left', 'right'];

const partsPrice = (catalogue: Catalogue, parts: { sku: string; quantity: number }[] | null) =>
  (parts ?? []).reduce(
    (sum, part) => sum + (catalogue[part.sku]?.pricePence ?? 0) * part.quantity,
    0,
  );

const stepOfLine = (step: string): Step => {
  if (step === 'Pergola') return 'structure';
  if (step === 'Lighting' || step === 'Heating') return 'addons';
  return 'styling';
};

interface PhotoProps {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
}

function Photo({ src, alt, sizes, eager = false }: PhotoProps) {
  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      width={PHOTO_WIDTH}
      height={PHOTO_HEIGHT}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      className={styles.photo}
    />
  );
}

// The builder laid out like a showroom: big studio photos that follow every choice on the left,
// four steps on the right, and the price and bag button always in view.
export function PhotoBuilder({ rules, catalogue, others, start, head }: Props) {
  const { build, summary, change, chooseSide, addToBag, pending, message } = usePergolaBuild(
    rules,
    catalogue,
    { size: 0, fixing: 'free-standing', ...start },
  );
  const [step, setStep] = useState<Step>('structure');
  const [view, setView] = useState<View>('whole');
  const [activeSide, setActiveSide] = useState<SideId>('front');

  const size = sizeOf(rules, build);
  const sides = size ? sidesOf(size, build.fixing) : [];
  const sideById = (id: SideId) => sides.find((side) => side.id === id);
  const optionOf = (id: SideId) =>
    rules.sides.find((option) => option.name === build.sides[id].option) ?? null;
  const fixingLabel = FIXINGS.find((fixing) => fixing.id === build.fixing)?.label ?? '';
  const dressed = sides.filter((side) => build.sides[side.id].option).length;

  const goTo = (next: Step) => {
    setStep(next);
    if (next === 'styling') setView(activeSide);
    else setView(next === 'overview' ? 'all' : 'whole');
  };
  const pickSide = (id: SideId) => {
    setActiveSide(id);
    setView(id);
  };
  const setSlats = (id: SideId, length: number, option: SideOption, slat: Slat) =>
    change({
      sides: {
        ...build.sides,
        [id]: { option: option.name, slats: Array(panelCount(option, length)).fill(slat) },
      },
    });

  const sideShot = (side: Side) => {
    const option = optionOf(side.id);
    return sidePhoto(side.length, sideLook(option, build.sides[side.id].slats));
  };
  const sideCaption = (side: Side) =>
    side.onWall ? 'On the wall' : (build.sides[side.id].option ?? 'Open');

  const sceneSides: SceneSide[] = sides.map((side) => {
    const option = optionOf(side.id);
    return {
      id: side.id,
      look: option && !side.onWall ? lookOf(option.name, option.kind) : null,
      slats: build.sides[side.id].slats,
    };
  });

  const stage = () => {
    if (view === 'spin' && size) {
      return (
        <>
          <div className={styles.scene}>
            <PergolaScene3D
              width={size.width}
              depth={size.depth}
              wallMounted={build.fixing === 'wall-mounted'}
              sides={sceneSides}
              led={lightingIncluded(rules) || build.lighting}
              heaters={build.heaters}
              evening={false}
              louvreAngle={35}
              view="corner"
              viewKey={0}
              photoMode={false}
              onCanvas={ignoreCanvas}
            />
          </div>
          <span className={styles.chip}>Drag to spin it round</span>
        </>
      );
    }
    if (view === 'all') {
      return (
        <div className={styles.grid}>
          {SIDE_ORDER.map((id) => {
            const side = sideById(id);
            if (!side) return null;
            return (
              <button key={id} type="button" className={styles.cell} onClick={() => pickSide(id)}>
                {side.onWall ? (
                  <Photo
                    src={wholePhoto(rules, size, build.fixing)}
                    alt=""
                    sizes="(min-width: 64rem) 30vw, 50vw"
                    eager
                  />
                ) : (
                  <Photo src={sideShot(side)} alt="" sizes="(min-width: 64rem) 30vw, 50vw" eager />
                )}
                <span className={styles.chip}>
                  <strong>{side.name}</strong> {sideCaption(side)}
                </span>
              </button>
            );
          })}
        </div>
      );
    }
    const side = view === 'whole' || view === 'spin' ? null : sideById(view);
    const src = side && !side.onWall ? sideShot(side) : wholePhoto(rules, size, build.fixing);
    const label = side
      ? `${side.name} side (${side.length} m) · ${sideCaption(side)}`
      : `${size?.label ?? ''} · ${fixingLabel}`;
    return (
      <>
        <Photo
          src={src}
          alt={`${rules.range} pergola, ${label}`}
          sizes="(min-width: 64rem) 60vw, 100vw"
          eager
        />
        <span className={styles.chip}>{label}</span>
      </>
    );
  };

  const structureStep = (
    <>
      <h3 className={styles.label}>Pergola type</h3>
      <div className={styles.choices}>
        {FIXINGS.map((fixing) => (
          <button
            key={fixing.id}
            type="button"
            className={styles.choice}
            aria-pressed={build.fixing === fixing.id}
            onClick={() => change({ fixing: fixing.id })}
          >
            <strong>{fixing.label}</strong>
            <small>{fixing.text}</small>
          </button>
        ))}
      </div>
      <h3 className={styles.label}>Choose a size</h3>
      <div className={styles.sizes}>
        {rules.sizes.map((option, index) => {
          const sku =
            build.fixing === 'wall-mounted' ? option.wallMountedSku : option.freeStandingSku;
          const price = catalogue[sku]?.pricePence;
          return (
            <button
              key={option.label}
              type="button"
              className={styles.size}
              aria-pressed={build.size === index}
              disabled={price === undefined}
              onClick={() => change({ size: index })}
            >
              <Photo src={wholePhoto(rules, option, build.fixing)} alt="" sizes="8rem" />
              <span>
                <strong>{option.label}</strong>
                <small>
                  {build.fixing === 'wall-mounted'
                    ? option.wallMountedSize
                    : option.freeStandingSize}
                </small>
                <b>{price === undefined ? 'Not on sale yet' : pounds(price)}</b>
              </span>
            </button>
          );
        })}
      </div>
      <BiggerSize rules={rules} others={others} />
    </>
  );

  const activeInfo = sideById(activeSide);
  const stylingStep = activeInfo && (
    <>
      <div className={styles.sideTabs} role="tablist" aria-label="Sides">
        {SIDE_ORDER.map((id) => {
          const side = sideById(id);
          if (!side) return null;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeSide === id}
              onClick={() => pickSide(id)}
            >
              <strong>{side.name}</strong>
              <small>{sideCaption(side)}</small>
            </button>
          );
        })}
      </div>
      {activeInfo.onWall ? (
        <p className={styles.note}>
          The back of a wall-mounted pergola is fixed to your wall, so it takes no screen or panels.
        </p>
      ) : (
        <>
          <h3 className={styles.label}>
            {activeInfo.name} side, {activeInfo.length} m
          </h3>
          <div className={styles.options}>
            <button
              type="button"
              className={styles.option}
              aria-pressed={!build.sides[activeSide].option}
              onClick={() => chooseSide(activeSide, null)}
            >
              <Photo src={sidePhoto(activeInfo.length, 'open')} alt="" sizes="12rem" />
              <strong>Leave open</strong>
              <small>No charge</small>
            </button>
            {optionsFor(rules, catalogue, activeInfo.length).map((option) => {
              const chosen = build.sides[activeSide].option === option.name;
              const slats = chosen ? build.sides[activeSide].slats : [];
              return (
                <button
                  key={option.name}
                  type="button"
                  className={styles.option}
                  aria-pressed={chosen}
                  onClick={() => chooseSide(activeSide, option.name)}
                >
                  <Photo
                    src={sidePhoto(activeInfo.length, sideLook(option, slats))}
                    alt=""
                    sizes="12rem"
                  />
                  <strong>{option.name}</strong>
                  <small>
                    +{' '}
                    {pounds(partsPrice(catalogue, partsForSide(option, activeInfo.length, slats)))}
                  </small>
                </button>
              );
            })}
          </div>
          {(() => {
            const option = optionOf(activeSide);
            if (!option || !canMixSlats(option, activeInfo.length)) return null;
            const look = sideLook(option, build.sides[activeSide].slats);
            return (
              <>
                <h3 className={styles.label}>
                  Slats · {panelCount(option, activeInfo.length)} panels on this side
                </h3>
                <div className={styles.choices}>
                  {(['horizontal', 'vertical'] as const).map((slat) => (
                    <button
                      key={slat}
                      type="button"
                      className={styles.choice}
                      aria-pressed={look === slat}
                      onClick={() => setSlats(activeSide, activeInfo.length, option, slat)}
                    >
                      <strong>{slat === 'horizontal' ? 'Horizontal' : 'Vertical'}</strong>
                    </button>
                  ))}
                </div>
              </>
            );
          })()}
        </>
      )}
    </>
  );

  const kitSku = size?.lightingKitSku;
  const kit = kitSku ? catalogue[kitSku] : undefined;
  const heater = rules.heaterSku ? catalogue[rules.heaterSku] : undefined;
  const addonsStep = (
    <>
      <h3 className={styles.label}>Add-ons</h3>
      <div className={styles.addons}>
        {lightingIncluded(rules) ? (
          <div className={styles.addon}>
            <span>
              <strong>LED lighting</strong>
              <small>Built into the beams as standard</small>
            </span>
            <b>Included</b>
          </div>
        ) : (
          kit && (
            <label className={styles.addon}>
              <span>
                <strong>LED lighting kit</strong>
                <small>Light strips for the beams, sized for this pergola</small>
              </span>
              <b>+ {pounds(kit.pricePence)}</b>
              <input
                type="checkbox"
                checked={build.lighting}
                onChange={(event) => change({ lighting: event.target.checked })}
              />
            </label>
          )
        )}
        {heater && (
          <div className={styles.addon}>
            <span>
              <strong>3kW linear heater</strong>
              <small>Fits to the beam and warms the seating area</small>
            </span>
            <b>+ {pounds(heater.pricePence)} each</b>
            <span className={styles.stepper}>
              <button
                type="button"
                aria-label="One fewer heater"
                disabled={build.heaters === 0}
                onClick={() => change({ heaters: build.heaters - 1 })}
              >
                −
              </button>
              <output aria-live="polite">{build.heaters}</output>
              <button
                type="button"
                aria-label="One more heater"
                disabled={build.heaters >= 4}
                onClick={() => change({ heaters: build.heaters + 1 })}
              >
                +
              </button>
            </span>
          </div>
        )}
      </div>
    </>
  );

  const overviewStep = (
    <>
      <h3 className={styles.label}>
        Your {rules.range} pergola · {size?.label} · {fixingLabel}
      </h3>
      <ul className={styles.lines}>
        {summary.lines.map((line) => {
          const cost = line.items.reduce((sum, item) => sum + item.pricePence * item.quantity, 0);
          return (
            <li key={line.step}>
              <span>
                <strong>{line.step}</strong>
                <small>{line.detail}</small>
              </span>
              <b>{cost ? pounds(cost) : line.items.length ? '' : '—'}</b>
              <button type="button" onClick={() => goTo(stepOfLine(line.step))}>
                Change
              </button>
            </li>
          );
        })}
      </ul>
      {summary.exactSize && <p className={styles.note}>Exact size: {summary.exactSize}</p>}
    </>
  );

  const index = STEPS.findIndex((item) => item.id === step);
  const previous = STEPS[index - 1];
  const following = STEPS[index + 1];
  const nextSide =
    step === 'styling'
      ? SIDE_ORDER.slice(SIDE_ORDER.indexOf(activeSide) + 1)
          .map(sideById)
          .find((side) => side && !side.onWall)
      : undefined;

  return (
    <div className={styles.builder}>
      {head}
      <div className={styles.layout}>
        <section className={styles.stage} aria-label="Preview">
          <div className={styles.frame}>{stage()}</div>
          <div className={styles.views} role="tablist" aria-label="Preview view">
            {(['whole', 'spin', 'all', ...SIDE_ORDER] as View[]).map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={view === option}
                onClick={() =>
                  option === 'whole' || option === 'all' || option === 'spin'
                    ? setView(option)
                    : pickSide(option)
                }
              >
                {option === 'whole'
                  ? 'Whole pergola'
                  : option === 'spin'
                    ? 'Spin in 3D'
                    : option === 'all'
                      ? 'All sides'
                      : (sideById(option)?.name ?? option)}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.panel} aria-label="Build your pergola">
          <ol className={styles.steps}>
            {STEPS.map((item, at) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={step === item.id ? 'step' : undefined}
                  data-done={at < index || undefined}
                  onClick={() => goTo(item.id)}
                >
                  <span>{at < index ? '✓' : at + 1}</span> {item.label}
                </button>
              </li>
            ))}
          </ol>

          <div className={styles.body}>
            {step === 'structure' && structureStep}
            {step === 'styling' && stylingStep}
            {step === 'addons' && addonsStep}
            {step === 'overview' && overviewStep}
          </div>

          <div className={styles.nav}>
            {previous ? (
              <button type="button" className="button-secondary" onClick={() => goTo(previous.id)}>
                ← {previous.label}
              </button>
            ) : (
              <span />
            )}
            {nextSide ? (
              <button
                type="button"
                className="button-secondary"
                onClick={() => pickSide(nextSide.id)}
              >
                Next: {nextSide.name.toLowerCase()} side →
              </button>
            ) : (
              following && (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => goTo(following.id)}
                >
                  Next: {following.label} →
                </button>
              )
            )}
          </div>

          <div className={styles.price}>
            <p className={styles.priceLine}>
              {size?.label} · {fixingLabel} ·{' '}
              {dressed === 0
                ? 'all sides open'
                : `${dressed} ${dressed === 1 ? 'side' : 'sides'} dressed`}
            </p>
            <p className={styles.total}>
              {pounds(summary.totalPence)} <small>inc. VAT</small>
            </p>
            <button
              type="button"
              className={`button ${styles.bag}`}
              disabled={!summary.ready || pending}
              onClick={addToBag}
            >
              {pending ? 'Adding…' : 'Add to bag'}
            </button>
            {message && (
              <p role="alert" className={styles.alert}>
                {message}
              </p>
            )}
          </div>
          {rules.messages.length > 0 && (
            <ul className={styles.messages}>
              {rules.messages.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
