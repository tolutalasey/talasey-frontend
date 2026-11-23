import 'server-only';
import { getRanges, rangePath } from '@/features/catalogue';
import { getAllFaqs, getGuides, guidePath, helpPath } from '@/features/content';
import { getSearchRecords, type SearchRecord } from '@/features/search';
import { formatPrice } from '@/lib/format';
import { productPath } from '@/lib/urls/keyword-map';

const DESCRIPTION_CHARS = 280;
const ANSWER_CHARS = 900;

const clip = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max).replace(/\s\S*$/, '')}…` : flat;
};

const AVAILABILITY: Record<SearchRecord['availability'][number], string> = {
  'in-stock': 'in stock',
  available: 'available to order',
  'made-to-order': 'made to order',
};

function productLine(product: SearchRecord): string {
  const details = [
    product.priceFrom !== null &&
      `from ${formatPrice({ amount: product.priceFrom, currencyCode: 'GBP' })}`,
    product.availability.map((kind) => AVAILABILITY[kind]).join(', '),
    product.categoryNames.length > 0 && `in ${product.categoryNames.join(', ')}`,
    product.colours.length > 1 && `colours: ${product.colours.map((c) => c.name).join(', ')}`,
    ...Object.entries(product.options)
      .filter(([name, values]) => name !== 'Colour' && values.length > 1)
      .map(([name, values]) => `${name.toLowerCase()}: ${values.join(', ')}`),
  ].filter(Boolean);
  const description = product.description ? ` ${clip(product.description, DESCRIPTION_CHARS)}` : '';
  return `- [${product.title}](${productPath(product.handle)}) (${details.join('; ')}).${description}`;
}

// What the site says, as plain text for the assistant to answer from: ranges, every published
// product with its price and stock, guides and help answers.
export async function assistantKnowledge(): Promise<string> {
  const [ranges, products, guides, faqs] = await Promise.all([
    getRanges(),
    getSearchRecords(),
    getGuides(),
    getAllFaqs(),
  ]);
  return [
    '# Ranges',
    ...ranges.map(
      (range) =>
        `- [${range.name}](${rangePath(range)}): ${clip(range.intro, DESCRIPTION_CHARS)}${
          range.buyingGuide.length > 0 ? ` Buying tips: ${range.buyingGuide.join(' ')}` : ''
        }`,
    ),
    '',
    '# Products (prices include VAT)',
    ...products.map(productLine),
    '',
    '# Guides',
    ...guides
      .filter((guide) => !guide.placeholder)
      .map(
        (guide) =>
          `- [${guide.title}](${guidePath(guide)}): ${clip(guide.answer, ANSWER_CHARS)}${
            guide.steps.length > 0 ? ` Steps: ${guide.steps.join(' ')}` : ''
          }`,
      ),
    '',
    '# Help',
    ...faqs.flatMap(({ topic, faqs: answers }) =>
      answers.length === 0
        ? []
        : [
            `## [${topic.name}](${helpPath(topic)})`,
            ...answers.map((faq) => `Q: ${faq.question}\nA: ${clip(faq.answer, ANSWER_CHARS)}`),
          ],
    ),
    '',
    '# Other pages',
    '- [Order free samples](/samples/)',
    '- [Find a stockist](/find-a-stockist/)',
    '- [Find an installer](/find-an-installer/)',
    '- [Book a showroom visit](/book-a-showroom-visit/)',
    '- [Brochures](/brochures/)',
    '- [Product finder](/product-finder/)',
    '- [Knowledge Hub](/knowledge-hub/)',
    '- [Contact us](/contact/): phone 0330 333 8030, email sales@talasey.co.uk',
  ].join('\n');
}
