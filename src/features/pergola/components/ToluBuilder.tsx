'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
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
  type SideId,
} from '../rules';
import { BiggerSize, type OtherBuilder } from './BiggerSize';
import { lookOf, type CameraView, type SceneSide } from './PergolaScene3D';
import { pounds, usePergolaBuild } from './usePergolaBuild';
import styles from './ToluBuilder.module.css';

const PergolaScene3D = dynamic(() => import('./PergolaScene3D'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading your 3D pergola…</div>,
});

const VIEWS: { id: CameraView; label: string }[] = [
  { id: 'corner', label: '3D' },
  { id: 'front', label: 'Front' },
  { id: 'top', label: 'Plan' },
];

const FIXINGS: { id: Fixing; label: string; detail: string }[] = [
  { id: 'free-standing', label: 'Free-standing', detail: 'Stands anywhere in the garden' },
  { id: 'wall-mounted', label: 'Wall-mounted', detail: 'The long back side fixes to your house' },
];

function Card({
  name,
  checked,
  onChange,
  title,
  detail,
  price,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  detail?: string;
  price?: string;
  children?: ReactNode;
}) {
  return (
    <label className={styles.card}>
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span className={styles.cardText}>
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
        {children}
      </span>
      {price && <span className={styles.cardPrice}>{price}</span>}
    </label>
  );
}

// Tolu's design: the 3D pergola from the first version of the site, built from the same real
// SKUs and rules as Amy's.
export function ToluBuilder({
  rules,
  catalogue,
  others,
  start,
  head,
}: {
  rules: PergolaRules;
  catalogue: Catalogue;
  others: OtherBuilder[];
  start?: Partial<Build>;
  head?: ReactNode;
}) {
  const { build, summary, change, chooseSide, chooseSlat, addToBag, pending, message } =
    usePergolaBuild(rules, catalogue, start);
  const [evening, setEvening] = useState(false);
  const [louvreAngle, setLouvreAngle] = useState(35);
  const [view, setView] = useState<CameraView>('corner');
  const [viewKey, setViewKey] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [sideTab, setSideTab] = useState<SideId>('front');
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  const size = sizeOf(rules, build) ?? rules.sizes[0] ?? null;
  const chosen = sizeOf(rules, build);
  const ready = Boolean(chosen && build.fixing);
  const lightingKit = chosen?.lightingKitSku ? catalogue[chosen.lightingKitSku] : undefined;
  const heater = rules.heaterSku ? catalogue[rules.heaterSku] : undefined;

  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo);
    },
    [photo],
  );

  useEffect(() => {
    const leave = () => {
      if (!document.fullscreenElement) setExpanded(false);
    };
    document.addEventListener('fullscreenchange', leave);
    return () => document.removeEventListener('fullscreenchange', leave);
  }, []);

  const showView = (next: CameraView) => {
    setView(next);
    setViewKey((key) => key + 1);
  };
  const onCanvas = useCallback((element: HTMLCanvasElement) => {
    canvas.current = element;
  }, []);

  const toggleFullScreen = () => {
    if (expanded) {
      if (document.fullscreenElement) void document.exitFullscreen();
      setExpanded(false);
      return;
    }
    setExpanded(true);
    stage.current?.requestFullscreen?.().catch(() => undefined);
  };

  const onPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    showView('front');
  };

  const saveImage = () => {
    if (!canvas.current) return;
    const link = document.createElement('a');
    link.download = `my-${rules.slug}.png`;
    link.href = canvas.current.toDataURL('image/png');
    link.click();
  };

  const sides = size ? sidesOf(size, build.fixing) : [];
  const sceneSides: SceneSide[] = sides.map((side) => {
    const option = rules.sides.find((candidate) => candidate.name === build.sides[side.id].option);
    return {
      id: side.id,
      look: option && !side.onWall ? lookOf(option.name, option.kind) : null,
      slats: build.sides[side.id].slats,
    };
  });
  const activeSide = sides.find((side) => side.id === sideTab);
  const fromPrice = (index: number) => {
    const option = rules.sizes[index];
    const prices = [option?.freeStandingSku, option?.wallMountedSku].flatMap((sku) =>
      sku && catalogue[sku] ? [catalogue[sku].pricePence] : [],
    );
    return prices.length ? pounds(Math.min(...prices)) : undefined;
  };

  return (
    <div className={styles.builder}>
      <div className={styles.preview}>
        <div
          ref={stage}
          className={styles.stage}
          data-photo={photo ? '' : undefined}
          data-expanded={expanded || undefined}
          style={photo ? { backgroundImage: `url(${photo})` } : undefined}
        >
          {size && (
            <PergolaScene3D
              width={size.width}
              depth={size.depth}
              wallMounted={build.fixing === 'wall-mounted'}
              sides={sceneSides}
              led={lightingIncluded(rules) || build.lighting}
              heaters={build.heaters}
              evening={evening}
              louvreAngle={louvreAngle}
              view={view}
              viewKey={viewKey}
              photoMode={Boolean(photo)}
              onCanvas={onCanvas}
            />
          )}
          <div className={styles.bar}>
            <div className={styles.segment} role="group" aria-label="Camera view">
              {VIEWS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={view === option.id}
                  onClick={() => showView(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className={styles.barGroup}>
              <div className={styles.segment} role="group" aria-label="Time of day">
                <button type="button" aria-pressed={!evening} onClick={() => setEvening(false)}>
                  Day
                </button>
                <button type="button" aria-pressed={evening} onClick={() => setEvening(true)}>
                  Evening
                </button>
              </div>
              <button
                type="button"
                className={styles.stageButton}
                aria-pressed={expanded}
                onClick={toggleFullScreen}
              >
                {expanded ? 'Exit full screen' : 'Full screen'}
              </button>
            </div>
          </div>
          <p className={styles.hint}>
            {chosen
              ? 'Drag to turn · Scroll or pinch to zoom'
              : `Showing ${size?.label ?? ''}. Choose a size to start your build.`}
          </p>
        </div>

        <div className={styles.actions}>
          <label className={styles.ghost}>
            <input type="file" accept="image/*" className={styles.hidden} onChange={onPhoto} />
            {photo ? 'Change garden photo' : 'See it in your garden'}
          </label>
          {photo && (
            <button type="button" className={styles.ghost} onClick={() => setPhoto(null)}>
              Remove photo
            </button>
          )}
          <button type="button" className={styles.ghost} onClick={saveImage}>
            Save image
          </button>
          <label className={styles.louvre}>
            <span>Louvre tilt</span>
            <input
              type="range"
              min={0}
              max={90}
              value={louvreAngle}
              onChange={(event) => setLouvreAngle(Number(event.target.value))}
            />
            <output>{louvreAngle}°</output>
          </label>
        </div>
        {photo && (
          <p className={styles.small}>
            Your photo stays on your device. Turn and zoom the pergola until it sits on your patio.
          </p>
        )}

        <div className={styles.summaryBar}>
          <div>
            <p className="eyebrow">Your design</p>
            <p className={styles.describe}>
              {ready && chosen
                ? `${rules.range}, ${chosen.label}, ${build.fixing}`
                : 'Choose a size and fixing'}
            </p>
          </div>
          <p className={styles.bigPrice}>{summary.totalPence ? pounds(summary.totalPence) : '—'}</p>
        </div>
      </div>

      <div className={styles.steps}>
        {head}
        <fieldset className={styles.options}>
          <legend>1. Size</legend>
          {rules.sizes.map((option, index) => (
            <Card
              key={option.label}
              name="tolu-size"
              checked={build.size === index}
              onChange={() => change({ size: index })}
              title={option.label}
              detail={`${option.width} m wide, ${option.depth} m deep`}
              price={fromPrice(index) && `from ${fromPrice(index)}`}
            />
          ))}
          <BiggerSize rules={rules} others={others} />
        </fieldset>

        <fieldset className={styles.options}>
          <legend>2. Fixing</legend>
          {FIXINGS.map((fixing) => (
            <Card
              key={fixing.id}
              name="tolu-fixing"
              checked={build.fixing === fixing.id}
              onChange={() => change({ fixing: fixing.id })}
              title={fixing.label}
              detail={fixing.detail}
            />
          ))}
          {ready && summary.exactSize && (
            <p className={styles.small}>Exact size: {summary.exactSize}.</p>
          )}
        </fieldset>

        <fieldset className={styles.options} disabled={!ready}>
          <legend>3. Sides</legend>
          <div className={styles.segment} role="group" aria-label="Which side">
            {sides.map((side) => (
              <button
                key={side.id}
                type="button"
                aria-pressed={sideTab === side.id}
                onClick={() => setSideTab(side.id)}
              >
                {side.name}
              </button>
            ))}
          </div>
          {activeSide &&
            (activeSide.onWall ? (
              <p className={styles.small}>
                The back is fixed to the wall, so it takes no side option.
              </p>
            ) : (
              <>
                <Card
                  name={`tolu-side-${activeSide.id}`}
                  checked={!build.sides[activeSide.id].option}
                  onChange={() => chooseSide(activeSide.id, null)}
                  title="Not required"
                  detail={`Open on the ${activeSide.name.toLowerCase()} side`}
                />
                {optionsFor(rules, catalogue, activeSide.length).map((option) => {
                  const parts = partsForSide(option, activeSide.length) ?? [];
                  const price = parts.reduce(
                    (sum, part) => sum + (catalogue[part.sku]?.pricePence ?? 0) * part.quantity,
                    0,
                  );
                  const checked = build.sides[activeSide.id].option === option.name;
                  return (
                    <Card
                      key={option.name}
                      name={`tolu-side-${activeSide.id}`}
                      checked={checked}
                      onChange={() => chooseSide(activeSide.id, option.name)}
                      title={option.name}
                      detail={
                        option.kind === 'Panels to mix'
                          ? `${panelCount(option, activeSide.length)} panels on this ${activeSide.length} m side`
                          : `Fits this ${activeSide.length} m side`
                      }
                      price={`+${pounds(price)}`}
                    >
                      {checked && canMixSlats(option, activeSide.length) && (
                        <span className={styles.slats}>
                          {build.sides[activeSide.id].slats.map((slat, index) => (
                            <button
                              key={index}
                              type="button"
                              aria-pressed={slat === 'vertical'}
                              aria-label={`Panel ${index + 1}: ${slat}`}
                              onClick={(event) => {
                                event.preventDefault();
                                chooseSlat(
                                  activeSide.id,
                                  index,
                                  slat === 'horizontal' ? 'vertical' : 'horizontal',
                                );
                              }}
                            >
                              {slat === 'horizontal' ? '☰' : '┃┃'}
                            </button>
                          ))}
                        </span>
                      )}
                    </Card>
                  );
                })}
              </>
            ))}
        </fieldset>

        <fieldset className={styles.options} disabled={!ready}>
          <legend>4. Lighting</legend>
          {lightingIncluded(rules) ? (
            <p className={styles.small}>
              LED lighting comes built in. Switch to Evening to see it.
            </p>
          ) : (
            <>
              <Card
                name="tolu-light"
                checked={!build.lighting}
                onChange={() => change({ lighting: false })}
                title="No lighting"
                detail="Add it later if you like"
              />
              {lightingKit && (
                <Card
                  name="tolu-light"
                  checked={build.lighting}
                  onChange={() => change({ lighting: true })}
                  title="RGB LED lighting kit"
                  detail="Built into the frame, remote included"
                  price={`+${pounds(lightingKit.pricePence)}`}
                />
              )}
            </>
          )}
        </fieldset>

        <fieldset className={styles.options} disabled={!ready}>
          <legend>5. Heating</legend>
          {heater && (
            <div className={styles.heaters}>
              <span>
                <strong>3kW linear heaters</strong>
                <small>{pounds(heater.pricePence)} each</small>
              </span>
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
                  onClick={() => change({ heaters: build.heaters + 1 })}
                >
                  +
                </button>
              </span>
            </div>
          )}
        </fieldset>

        <section className={styles.quote} aria-labelledby="quote-title">
          <h2 id="quote-title">Your price</h2>
          {summary.lines.length === 0 ? (
            <p className={styles.small}>Choose a size and fixing to see your price.</p>
          ) : (
            <dl className={styles.breakdown}>
              {summary.lines.flatMap((line) =>
                line.items.map((item) => (
                  <div key={`${line.step}-${item.sku}`}>
                    <dt>
                      {item.quantity > 1 ? `${item.quantity} × ` : ''}
                      {item.name}
                      <small>{line.step}</small>
                    </dt>
                    <dd>{pounds(item.pricePence * item.quantity)}</dd>
                  </div>
                )),
              )}
              <div className={styles.breakdownTotal}>
                <dt>Total, inc. VAT and delivery</dt>
                <dd>{pounds(summary.totalPence)}</dd>
              </div>
            </dl>
          )}
          {rules.messages.length > 0 && (
            <ul className={styles.messages}>
              {rules.messages.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          )}
          {message && (
            <p className={styles.error} role="alert">
              {message}
            </p>
          )}
          <button
            type="button"
            className={`button ${styles.add}`}
            disabled={!summary.ready || pending}
            onClick={addToBag}
          >
            {pending ? 'Adding your design…' : 'Add design to bag'}
          </button>
        </section>
      </div>
    </div>
  );
}
