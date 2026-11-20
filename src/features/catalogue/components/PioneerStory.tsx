import NextLink from 'next/link';
import styles from './PioneerStory.module.css';

const CLAIMS = [
  { value: '4K', label: 'Ultra-realistic detail' },
  { value: 'Low', label: 'Maintenance' },
  { value: 'Recycled', label: 'Resources' },
  { value: 'Trade', label: 'Sample service' },
];

const REASONS = [
  {
    title: 'Realistic 4K woodgrain',
    text: 'Genuine timber scans recreate every grain, knot and tonal shift in remarkable detail.',
  },
  {
    title: 'Built for demanding projects',
    text: 'A durable composite construction that is easy to clean and needs minimal upkeep.',
  },
  {
    title: 'A smarter timber alternative',
    text: 'Made using recycled resources, with no need for staining, sealing or harsh treatments.',
  },
];

const FINISHES = [
  { name: 'Darker Oak', tone: 'Warm amber streaks', swatch: '#6b4a32' },
  { name: 'Jacaranda', tone: 'Caramel & honey tones', swatch: '#a87447' },
  { name: 'Natural Ipe', tone: 'Rich espresso brown', swatch: '#4a3226' },
];

const AUDIENCE = [
  'Landscapers',
  'Garden designers',
  'Decking installers',
  'Builders & trade professionals',
  'Homeowners',
];

const SAMPLE_BOX = '/contact/?topic=samples';

// The current site's Pioneer page, above the Pioneer products: what it is, the three finishes and
// the free sample box.
export function PioneerStory() {
  return (
    <section className={styles.story} aria-labelledby="pioneer-story">
      <div className={`frame ${styles.hero}`}>
        <p className="eyebrow">Pioneer advanced composite decking</p>
        <h2 id="pioneer-story">See it. Feel it. Specify with confidence.</h2>
        <p>
          Discover next-generation composite decking with ultra-realistic woodgrain and lasting
          performance. Order your free Pioneer sample box and experience the finish first-hand.
        </p>
        <ul className={styles.claims}>
          {CLAIMS.map((claim) => (
            <li key={claim.value}>
              <strong>{claim.value}</strong> {claim.label}
            </li>
          ))}
        </ul>
        <p>
          <NextLink href={SAMPLE_BOX} className="button">
            Request your free sample box
          </NextLink>
        </p>
      </div>

      <div className={`frame ${styles.panel}`}>
        <p className="eyebrow">Why Pioneer</p>
        <h2>The beauty of rare hardwood. Reimagined.</h2>
        <p>
          A premium advanced composite created for professionals who refuse to compromise between
          natural character and dependable performance.
        </p>
        <ol className={styles.reasons}>
          {REASONS.map((reason) => (
            <li key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={`frame ${styles.panel}`}>
        <p className="eyebrow">Three distinctive finishes</p>
        <h2>Choose by look. Confirm by touch.</h2>
        <p>
          Compare the depth, grain and tonal variation of Pioneer in person before presenting it to
          your client.
        </p>
        <ul className={styles.finishes}>
          {FINISHES.map((finish) => (
            <li key={finish.name}>
              <span className={styles.swatch} style={{ background: finish.swatch }} />
              <h3>{finish.name}</h3>
              <p>{finish.tone}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={`frame ${styles.panel}`}>
        <p className="eyebrow">Your sample box</p>
        <h2>Bring Pioneer into the conversation</h2>
        <p>
          Show clients the depth of the 4K woodgrain, compare the three hardwood-inspired shades and
          feel the quality before you specify. Pioneer sample boxes are primarily intended for UK
          trade professionals considering advanced composite decking for an upcoming project.
        </p>
        <ul className={styles.audience}>
          {AUDIENCE.map((who) => (
            <li key={who}>{who}</li>
          ))}
        </ul>
        <ul className={styles.why}>
          <li>Compare the colours in natural light</li>
          <li>Feel the realistic surface texture</li>
          <li>Present Pioneer confidently to clients</li>
        </ul>
        <p>
          <NextLink href={SAMPLE_BOX} className="button">
            Request your free sample box
          </NextLink>
        </p>
      </div>
    </section>
  );
}
