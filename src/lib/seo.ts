import type { Metadata } from 'next';
import { absoluteUrl, site } from './site';

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  // Filter and search states: followed for their links but kept out of the index.
  noindex?: boolean;
  // The photo shown when the page is shared; pages without one use the site's own.
  image?: string | null;
}

const SHARE_IMAGE = { url: '/images/brand/share.jpg', width: 1200, height: 630 };

export function pageMetadata({ title, description, path, noindex, image }: PageSeo): Metadata {
  const shareImage = image ? { url: image } : SHARE_IMAGE;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      locale: 'en_GB',
      type: 'website',
      images: [shareImage],
    },
    twitter: { card: 'summary_large_image', images: [shareImage.url] },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type Availability = 'InStock' | 'MadeToOrder' | 'OutOfStock';

export interface ProductSchemaInput {
  name: string;
  description: string;
  path: string;
  sku?: string | null;
  image?: string | null;
  brand: string;
  price: { amount: number; currencyCode: string } | null;
  gtin?: string | null;
  mpn?: string | null;
  color?: string | null;
  size?: string | null;
  availability?: Availability;
  // Made-to-measure items are the exception to the business-wide returns policy.
  returnable?: boolean;
}

const RETURNS_COUNTRY = 'GB';

// The business-wide returns policy (PRD section 13): the 14-day right to cancel. Products point
// to it through the Organization; made-to-measure items override it.
export const returnPolicyJsonLd = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: RETURNS_COUNTRY,
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 14,
};

const NOT_RETURNABLE = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: RETURNS_COUNTRY,
  returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
};

export function productJsonLd(product: ProductSchemaInput) {
  const url = absoluteUrl(product.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url,
    brand: { '@type': 'Brand', name: product.brand },
    ...(product.sku && { sku: product.sku }),
    ...(product.gtin && { gtin: product.gtin }),
    ...(product.mpn && { mpn: product.mpn }),
    ...(product.color && { color: product.color }),
    ...(product.size && { size: product.size }),
    ...(product.image && { image: [absoluteUrl(product.image)] }),
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        url,
        price: product.price.amount.toFixed(2),
        priceCurrency: product.price.currencyCode,
        itemCondition: 'https://schema.org/NewCondition',
        ...(product.availability && {
          availability: `https://schema.org/${product.availability}`,
        }),
        seller: { '@type': 'Organization', name: site.legalName },
        ...(product.returnable === false && { hasMerchantReturnPolicy: NOT_RETURNABLE }),
      },
    }),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/icon.svg'),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: absoluteUrl('/contact/'),
      areaServed: 'GB',
      availableLanguage: 'en-GB',
    },
    hasMerchantReturnPolicy: returnPolicyJsonLd,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl('/'),
    inLanguage: site.locale,
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/search/')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface ListedItem {
  name: string;
  path: string;
}

export function collectionPageJsonLd(page: { name: string; path: string }, items: ListedItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.name,
    url: absoluteUrl(page.path),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  path: string;
  author: { name: string; isPerson: boolean };
  datePublished: string;
  dateModified?: string | null;
}

export function articleJsonLd(article: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    mainEntityOfPage: absoluteUrl(article.path),
    author: {
      '@type': article.author.isPerson ? 'Person' : 'Organization',
      name: article.author.name,
    },
    publisher: { '@id': absoluteUrl('/#organization') },
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    inLanguage: site.locale,
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
