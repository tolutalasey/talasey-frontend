import type { Product, ProductVariant } from '@/api-client';
import type { ReactNode } from 'react';
import { formatPrice } from '@/lib/format';
import type { ProductContent } from '../content';
import styles from './ProductPage.module.css';

interface ProductFactsProps {
  product: Product;
  variant: ProductVariant | null;
  brand: string | null;
  content: ProductContent;
}

interface Section {
  id: string;
  title: string;
  body: ReactNode;
}

const paragraphsOf = (text: string | null | undefined) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

function Paragraphs({ text }: { text: string[] }) {
  return text.map((paragraph) => (
    <p key={paragraph} className={styles.description}>
      {paragraph}
    </p>
  ));
}

// Several paragraphs are steps, so they read as a numbered list.
function Steps({ steps }: { steps: string[] }) {
  if (steps.length === 1) return <Paragraphs text={steps} />;
  return (
    <ol className={styles.steps}>
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  );
}

function specsOf({ variant, brand, content }: Omit<ProductFactsProps, 'product'>) {
  return [
    ...(brand ? [['Brand', brand]] : []),
    ...Object.entries(variant?.options ?? {}),
    ...(variant?.coverageM2 ? [['Coverage per pack', `${variant.coverageM2} m²`]] : []),
    ...(variant?.weightKg ? [['Weight', `${variant.weightKg} kg`]] : []),
    ...(content.warranty ? [['Guarantee', content.warranty]] : []),
    ...(variant?.sku ? [['Product code', variant.sku]] : []),
  ] as [string, string][];
}

function sectionsOf({ product, variant, brand, content }: ProductFactsProps): Section[] {
  const about = paragraphsOf(product.description);
  const installation = paragraphsOf(content.installation);
  const care = paragraphsOf(content.care);
  const specs = specsOf({ variant, brand, content });

  const sections: (Section | false)[] = [
    about.length > 0 && {
      id: 'about',
      title: 'About this product',
      body: (
        <>
          <Paragraphs text={about} />
          {content.features.length > 0 && (
            <ul>
              {content.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}
        </>
      ),
    },
    specs.length > 0 && {
      id: 'specifications',
      title: 'Specifications',
      body: (
        <dl className={styles.specs}>
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    installation.length > 0 && {
      id: 'installation',
      title: 'Installation',
      body: <Steps steps={installation} />,
    },
    care.length > 0 && {
      id: 'care',
      title: 'Care and maintenance',
      body: <Paragraphs text={care} />,
    },
    content.faqs.length > 0 && {
      id: 'questions',
      title: 'Questions',
      body: (
        <div className={styles.faqs}>
          {content.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <Paragraphs text={paragraphsOf(faq.answer)} />
            </details>
          ))}
        </div>
      ),
    },
    product.variants.length > 1 && {
      id: 'options',
      title: 'All options and prices',
      body: (
        <table className={styles.options}>
          <caption className={styles.visuallyHidden}>Options and prices</caption>
          <thead>
            <tr>
              <th scope="col">Option</th>
              <th scope="col">Price inc. VAT</th>
            </tr>
          </thead>
          <tbody>
            {product.variants.map((option) => (
              <tr key={option.id}>
                <th scope="row">{option.title}</th>
                <td>{option.priceIncVat ? formatPrice(option.priceIncVat) : 'Price on request'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    content.documents.length > 0 && {
      id: 'downloads',
      title: 'Downloads',
      body: (
        <ul>
          {content.documents.map((document) => (
            <li key={document.url}>
              <a href={document.url}>{document.title}</a>
            </li>
          ))}
        </ul>
      ),
    },
  ];
  return sections.filter((section): section is Section => Boolean(section));
}

// Everything about the product in plain HTML, for people and for search and AI crawlers
// (PRD section 14), with a short menu to jump to each part. Only parts that have content show.
export function ProductFacts(props: ProductFactsProps) {
  const sections = sectionsOf(props);
  if (sections.length === 0) return null;
  return (
    <div className={`frame ${styles.facts}`}>
      {sections.length > 2 && (
        <nav aria-label="On this page" className={styles.factsNav}>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </nav>
      )}
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className={styles.factsSection}
        >
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          {section.body}
        </section>
      ))}
    </div>
  );
}
