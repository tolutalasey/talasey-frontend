import type { PergolaContent } from '../content';
import styles from './PergolaProduct.module.css';

// The exact sizes and the range's details, in plain HTML for shoppers and search engines.
export function PergolaDetails({ builder }: { builder: PergolaContent }) {
  return (
    <section className={`frame ${styles.details}`} aria-labelledby="pergola-details">
      <h2 id="pergola-details">Sizes and details</h2>
      <details open>
        <summary>Specification: exact dimensions and height</summary>
        <table className={styles.spec}>
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Free-standing</th>
              <th scope="col">Wall-mounted</th>
            </tr>
          </thead>
          <tbody>
            {builder.sizes.map((size) => (
              <tr key={size.label}>
                <th scope="row">{size.label}</th>
                <td>{size.freeStandingSize ?? '—'}</td>
                <td>{size.wallMountedSize ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      {builder.details.map((detail) => (
        <details key={detail.heading}>
          <summary>{detail.heading}</summary>
          {detail.text.split(/\n\s*\n/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </details>
      ))}
    </section>
  );
}
