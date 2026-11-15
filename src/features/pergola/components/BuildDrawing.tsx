import type { ReactNode } from 'react';
import {
  PANELS,
  lightingIncluded,
  panelCount,
  sidesOf,
  sizeOf,
  type Build,
  type PergolaRules,
  type SideId,
} from '../rules';
import styles from './AmyBuilder.module.css';

type Point = [number, number];

const CAMERA = { x: -1.2, eye: 0.8, focal: 5 };
const ROOF = 2.5;
const BEAM = 0.28;
const FRAME = '#2B302D';

const project = (x: number, y: number, z: number): Point => {
  const k = CAMERA.focal / (CAMERA.focal + z);
  return [(x - CAMERA.x) * k, -(y - CAMERA.eye) * k];
};

function bounds(width: number, depth: number) {
  const corners = [0, width].flatMap((x) =>
    [0, ROOF + BEAM].flatMap((y) => [0, depth].map((z) => project(x, y, z))),
  );
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

const points = (list: Point[]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const look = (name: string, kind: string) => {
  if (kind === PANELS) return 'panels';
  const lower = name.toLowerCase();
  if (lower.includes('wind')) return lower.includes('motor') ? 'motorised' : 'screen';
  if (lower.includes('glass')) return 'glass';
  if (lower.includes('door')) return 'doors';
  if (lower.includes('louvre')) return 'louvres';
  return 'solid';
};

// The pergola drawn in perspective, each part appearing as it's chosen (Amy's mockup, tab 4).
export function BuildDrawing({ rules, build }: { rules: PergolaRules; build: Build }) {
  const size = sizeOf(rules, build);
  if (!size) {
    return (
      <svg
        viewBox="0 0 400 300"
        className={styles.svg}
        role="img"
        aria-label="No pergola chosen yet"
      >
        <ellipse cx="200" cy="250" rx="165" ry="26" fill="#E6DDD3" />
        <text x="200" y="150" textAnchor="middle" className={styles.svgHint}>
          Choose a size to start your build
        </text>
      </svg>
    );
  }

  const biggest = [...rules.sizes].sort((a, b) => b.width * b.depth - a.width * a.depth)[0] ?? size;
  const big = bounds(biggest.width, biggest.depth);
  const scale = Math.min(370 / (big.x1 - big.x0), 245 / (big.y1 - big.y0));
  const W = size.width;
  const D = size.depth;
  const own = bounds(W, D);
  const ox = 200 - (scale * (own.x0 + own.x1)) / 2;
  const oy = 150 - (scale * (own.y0 + own.y1)) / 2;
  const P = (x: number, y: number, z: number): Point => {
    const [px, py] = project(x, y, z);
    return [ox + px * scale, oy + py * scale];
  };
  const line = (a: Point, b: Point, stroke: string, width: number, key: string) => (
    <line key={key} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={stroke} strokeWidth={width} />
  );
  const wall = build.fixing === 'wall-mounted';

  const faces: Record<SideId, [[number, number], [number, number]]> = {
    front: [
      [0, 0],
      [W, 0],
    ],
    back: [
      [0, D],
      [W, D],
    ],
    left: [
      [0, 0],
      [0, D],
    ],
    right: [
      [W, 0],
      [W, D],
    ],
  };
  const sides = sidesOf(size, build.fixing);

  const sidePanel = (id: SideId): ReactNode => {
    const side = sides.find((candidate) => candidate.id === id);
    const choice = build.sides[id];
    const option = rules.sides.find((candidate) => candidate.name === choice.option);
    if (!side || side.onWall || !option) return null;
    const [a, c] = faces[id];
    const top = ROOF - 0.06;
    const at = (f: number, y: number) => P(a[0] + (c[0] - a[0]) * f, y, a[1] + (c[1] - a[1]) * f);
    const outline = [at(0, 0), at(1, 0), at(1, top), at(0, top)];
    const style = look(option.name, option.kind);
    const extra: ReactNode[] = [];
    let fill = '#3A403C';
    const divide = (n: number) => {
      for (let i = 1; i < n; i++)
        extra.push(line(at(i / n, 0), at(i / n, top), '#1F2421', 2.2, `d${i}`));
    };
    if (style === 'screen' || style === 'motorised') {
      fill = 'rgba(70,74,70,.55)';
      const strands = side.length * 6;
      for (let i = 1; i < strands; i++) {
        extra.push(
          line(at(i / strands, 0), at(i / strands, top - 0.18), 'rgba(30,34,32,.35)', 0.8, `s${i}`),
        );
      }
      extra.push(
        <polygon
          key="box"
          points={points([at(0, top - 0.18), at(1, top - 0.18), at(1, top), at(0, top)])}
          fill={FRAME}
        />,
      );
      if (style === 'motorised') {
        const [mx, my] = at(0.06, top - 0.09);
        extra.push(<circle key="motor" cx={mx} cy={my} r={2.6} fill="#7FD1FF" />);
      }
    }
    if (style === 'panels') {
      const n = panelCount(option, side.length);
      choice.slats.slice(0, n).forEach((slat, m) => {
        const f0 = m / n;
        const f1 = (m + 1) / n;
        if (slat === 'horizontal') {
          for (let i = 1; i < 16; i++)
            extra.push(
              line(at(f0, (i * top) / 16), at(f1, (i * top) / 16), '#69716D', 1.3, `h${m}-${i}`),
            );
        } else {
          for (let i = 1; i < 8; i++) {
            const f = f0 + ((f1 - f0) * i) / 8;
            extra.push(line(at(f, 0), at(f, top), '#69716D', 1.1, `v${m}-${i}`));
          }
        }
      });
      divide(n);
    }
    if (style === 'louvres') {
      fill = '#4A514D';
      for (let i = 1; i < 11; i++) {
        const y = (i * top) / 11;
        extra.push(
          <polygon
            key={`l${i}`}
            points={points([at(0, y - 0.07), at(1, y - 0.07), at(1, y), at(0, y)])}
            fill="#7C8580"
          />,
        );
      }
    }
    if (style === 'doors') {
      fill = '#94663F';
      for (let i = 1; i < 10; i++)
        extra.push(
          line(at(0, (i * top) / 10), at(1, (i * top) / 10), 'rgba(60,35,15,.35)', 0.8, `w${i}`),
        );
      divide(side.length === 6 ? 6 : 3);
    }
    if (style === 'glass') {
      fill = 'rgba(150,200,220,.4)';
      divide(side.length === 6 ? 8 : 4);
    }
    return (
      <g key={`${id}-${option.name}-${choice.slats.join('')}-${W}x${D}`} className={styles.pop}>
        <polygon points={points(outline)} fill={fill} stroke="#1F2421" strokeWidth={1.4} />
        {extra}
      </g>
    );
  };

  const post = (x: number, z: number) => {
    const [bx, by] = P(x, 0, z);
    const [, ty] = P(x, ROOF + BEAM, z);
    const w = (7 * CAMERA.focal) / (CAMERA.focal + z);
    return <rect x={bx - w / 2} y={ty} width={w} height={by - ty} fill={FRAME} />;
  };
  const band = (a: [number, number], c: [number, number]) =>
    points([
      P(a[0], ROOF, a[1]),
      P(c[0], ROOF, c[1]),
      P(c[0], ROOF + BEAM, c[1]),
      P(a[0], ROOF + BEAM, a[1]),
    ]);

  const louvres = Array.from({ length: W * 3 - 1 }, (_, i) =>
    line(P((i + 1) / 3, ROOF, 0), P((i + 1) / 3, ROOF, D), '#6B736F', 1.3, `r${i}`),
  );
  const ledOn = lightingIncluded(rules) || build.lighting;
  const edge = [
    P(0, ROOF - 0.04, 0),
    P(W, ROOF - 0.04, 0),
    P(W, ROOF - 0.04, D),
    P(0, ROOF - 0.04, D),
    P(0, ROOF - 0.04, 0),
  ];
  const heaters = Math.min(build.heaters, 6);
  const fixing = build.fixing ? `, ${build.fixing}` : '';

  return (
    <svg
      viewBox="0 0 400 300"
      className={styles.svg}
      role="img"
      aria-label={`${rules.range} pergola, ${W} by ${D} metres${fixing}`}
    >
      <ellipse cx="200" cy={P(W / 2, 0, D / 2)[1] + 4} rx="190" ry="40" fill="#E6DDD3" />
      {wall && (
        <g key={`wall-${W}`} className={styles.pop}>
          <polygon
            points={points([P(-2, 0, D), P(W + 2, 0, D), P(W + 2, 3.4, D), P(-2, 3.4, D)])}
            fill="#C4AE95"
          />
          {Array.from({ length: 13 }, (_, i) =>
            line(P(-2, 0.25 * (i + 1), D), P(W + 2, 0.25 * (i + 1), D), '#A8927A', 1, `b${i}`),
          )}
        </g>
      )}
      <g key={`base-${W}-${build.fixing}`} className={styles.pop}>
        <polygon points={points([P(0, 0, 0), P(W, 0, 0), P(W, 0, D), P(0, 0, D)])} fill="#D2CABE" />
        {!wall && post(0, D)}
        {!wall && post(W, D)}
      </g>
      {sidePanel('back')}
      {sidePanel('right')}
      <g key={`roof-${W}`} className={styles.pop}>
        <polygon
          points={points([P(0, ROOF, 0), P(W, ROOF, 0), P(W, ROOF, D), P(0, ROOF, D)])}
          fill="#4A514D"
        />
        {louvres}
        <polygon points={band([0, D], [W, D])} fill={FRAME} />
        <polygon points={band([W, 0], [W, D])} fill={FRAME} />
      </g>
      {ledOn && (
        <g key={`led-${W}`} className={styles.pop}>
          <polyline
            points={points(edge)}
            fill="none"
            stroke="#FFE27A"
            strokeWidth={8}
            opacity={0.4}
          />
          <polyline points={points(edge)} fill="none" stroke="#FFD23F" strokeWidth={2.5} />
        </g>
      )}
      {Array.from({ length: heaters }, (_, h) => {
        const x = (W * (h + 0.5)) / heaters;
        const a = P(x - 0.6, ROOF - 0.1, D - 0.15);
        const c = P(x + 0.6, ROOF - 0.1, D - 0.15);
        const a2 = P(x - 0.6, ROOF - 0.24, D - 0.15);
        const c2 = P(x + 0.6, ROOF - 0.24, D - 0.15);
        return (
          <g key={`heater-${h}-${heaters}-${W}`} className={styles.pop}>
            <polygon points={points([a, c, c2, a2])} fill="#8E2B22" />
            <polygon
              points={points([
                a2,
                c2,
                P(x + 0.8, ROOF - 0.9, D - 0.15),
                P(x - 0.8, ROOF - 0.9, D - 0.15),
              ])}
              fill="#FF7A45"
              opacity={0.22}
            />
          </g>
        );
      })}
      <g key={`frame-${W}`}>
        <polygon points={band([0, 0], [0, D])} fill="#353B37" />
        <polygon points={band([0, 0], [W, 0])} fill={FRAME} />
        {post(W, 0)}
      </g>
      {sidePanel('left')}
      {sidePanel('front')}
      {post(0, 0)}
      <text x="200" y="292" textAnchor="middle" className={styles.svgCaption}>
        {rules.range} · {W} m wide × {D} m deep{fixing}
      </text>
    </svg>
  );
}
