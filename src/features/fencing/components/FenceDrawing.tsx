import styles from './FenceBuilder.module.css';

interface Props {
  bays: number;
  boards: number;
  topper: boolean;
  colour: string;
}

const BAY = 60;
const BOARD = 6;
const POST = 5;
const TOPPER = 14;
const MAX_DRAWN_BAYS = 12;

// A front view of the run: posts, boards to the chosen height and a trellis band on top. Long
// runs are drawn shortened, with the count of bays written underneath.
export function FenceDrawing({ bays, boards, topper, colour }: Props) {
  const drawn = Math.min(bays, MAX_DRAWN_BAYS);
  const panel = boards * BOARD;
  const top = topper ? TOPPER : 0;
  const width = drawn * BAY + POST;
  const height = panel + top + 4;
  return (
    <figure className={styles.drawing}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${bays} bays, ${boards} boards high${topper ? ' with trellis on top' : ''}`}
      >
        {Array.from({ length: drawn }, (_, bay) => (
          <g key={bay} transform={`translate(${bay * BAY + POST} 0)`}>
            {topper && (
              <rect
                x={0}
                y={2}
                width={BAY - POST}
                height={TOPPER - 2}
                className={styles.trellis}
                style={{ color: colour }}
              />
            )}
            {Array.from({ length: boards }, (_, board) => (
              <rect
                key={board}
                x={0}
                y={top + board * BOARD + 2}
                width={BAY - POST}
                height={BOARD - 1}
                rx={1}
                fill={colour}
              />
            ))}
          </g>
        ))}
        {Array.from({ length: drawn + 1 }, (_, post) => (
          <rect
            key={post}
            x={post * BAY}
            y={0}
            width={POST}
            height={height}
            className={styles.post}
          />
        ))}
      </svg>
      {bays > MAX_DRAWN_BAYS && <figcaption>Shortened: the full run is {bays} bays.</figcaption>}
    </figure>
  );
}
