import type { Product, ProductVariant } from '@/api-client';
import { formatPrice } from '@/lib/format';
import type { ProductContent } from '../content';
import styles from './ProductPage.module.css';

interface ProductFactsProps {
  product: Product;
  variant: ProductVariant | null;
  brand: string | null;
  content: ProductContent;
}

// Specifications and downloads in plain text in the HTML, for people and for search and AI
// crawlers (PRD section 14). Only facts the product data has are shown.
export function ProductFacts({ product, variant, brand, content }: ProductFactsProps) {
  const specs: [string, string][] = [
    ...(brand ? [['Brand', brand] as [string, string]] : []),
    ...Object.entries(variant?.options ?? {}),
    ...(variant?.coverageM2
      ? [['Coverage per pack', `${variant.coverageM2} m²`] as [string, string]]
      : []),
    ...(variant?.weightKg ? [['Weight', `${variant.weightKg} kg`] as [string, string]] : []),
    ...(content.warranty ? [['Guarantee', content.warranty] as [string, string]] : []),
    ...(variant?.sku ? [['Product code', variant.sku] as [string, string]] : []),
  ];

  return (
    <div className={`frame ${styles.facts}`}>
      {product.description && (
        <section aria-labelledby="about-title">
          <h2 id="about-title">About this product</h2>
          <p className={styles.description}>{product.description}</p>
          {content.features.length > 0 && (
            <ul>
              {content.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section aria-labelledby="specs-title">
        <h2 id="specs-title">Specifications</h2>
        <dl className={styles.specs}>
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {product.variants.length > 1 && (
        <section aria-labelledby="options-title">
          <h2 id="options-title">All options and prices</h2>
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
                  <td>
                    {option.priceIncVat ? formatPrice(option.priceIncVat) : 'Price on request'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {content.documents.length > 0 && (
        <section aria-labelledby="downloads-title">
          <h2 id="downloads-title">Downloads</h2>
          <ul>
            {content.documents.map((document) => (
              <li key={document.url}>
                <a href={document.url}>{document.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
