import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import type { PergolaContent } from '../content';
import type { Catalogue } from '../rules';
import { AmyBuilder } from './AmyBuilder';
import type { OtherBuilder } from './BiggerSize';
import { ToluBuilder } from './ToluBuilder';
import styles from './PergolaBuilderPage.module.css';

export type Design = 'amy' | 'tolu';

export const DESIGNS: { id: Design; label: string; short: string; detail: string }[] = [
  { id: 'amy', label: 'Design A', short: 'Step by step', detail: "Step by step, from Amy's spec" },
  { id: 'tolu', label: 'Design B', short: 'In 3D', detail: "In 3D, from Tolu's first version" },
];

interface Props {
  builder: PergolaContent;
  catalogue: Catalogue;
  others: OtherBuilder[];
  design: Design;
  path: string;
}

// One pergola range's builder page (page type 4), in either of the two designs being compared.
export function PergolaBuilderPage({ builder, catalogue, others, design, path }: Props) {
  const Builder = design === 'tolu' ? ToluBuilder : AmyBuilder;
  return (
    <article className={styles.page}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Pergolas', path: '/pergolas/' },
          { name: `${builder.range} pergola`, path },
        ]}
      />
      <header className={styles.header}>
        <div>
          <p className="eyebrow">Build your pergola</p>
          <h1>{builder.range} pergola</h1>
          <p className={styles.intro}>{builder.intro}</p>
        </div>
        <nav className={styles.designs} aria-label="Builder design">
          {DESIGNS.map((option) => (
            <NextLink
              key={option.id}
              href={option.id === 'amy' ? path : `${path}?design=${option.id}`}
              aria-current={option.id === design ? 'page' : undefined}
              scroll={false}
            >
              <strong>{option.label}</strong>
              <small>{option.detail}</small>
            </NextLink>
          ))}
        </nav>
      </header>

      <Builder rules={builder} catalogue={catalogue} others={others} />

      <section className={`frame ${styles.details}`} aria-labelledby="pergola-details">
        <h2 id="pergola-details">Product details</h2>
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
    </article>
  );
}
