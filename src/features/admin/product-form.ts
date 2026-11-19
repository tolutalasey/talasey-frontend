import { decimal, pence, text, whole } from '@/features/staff';
import type { AdminProduct, ProductInput } from './types';

type ProductPageType = ProductInput['pageType'];
type StockMode = ProductInput['stockMode'];

export interface UploadedPhoto {
  url: string;
  width: number;
  height: number;
}

// Blank rows under the options table, for adding options without leaving the page.
export const NEW_OPTION_ROWS = 3;

const SHOWS_SEPARATOR = '::';

// The choices for "this photo shows", one per option value, like Colour: Kandla Grey.
export const photoShowsChoices = (options: { title: string; values: string[] }[]) =>
  options.flatMap((option) =>
    option.values.map((value) => ({
      value: `${option.title}${SHOWS_SEPARATOR}${value}`,
      label: `${option.title}: ${value}`,
    })),
  );

export const photoShowsValue = (shows: { option: string; value: string } | null | undefined) =>
  shows ? `${shows.option}${SHOWS_SEPARATOR}${shows.value}` : '';

const photoShowsFrom = (form: FormData, name: string) => {
  const [option, value] = (text(form, name) ?? '').split(SHOWS_SEPARATOR);
  return option && value ? { option, value } : null;
};

const optionNamesFrom = (form: FormData, current: AdminProduct) => {
  const typed = text(form, 'optionNames');
  if (typed === null) return form.has('optionNames') ? [] : current.options.map((o) => o.title);
  return [
    ...new Set(
      typed
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean),
    ),
  ];
};

const valuesOf = (variants: { options: Record<string, string> }[], name: string) => [
  ...new Set(variants.flatMap((variant) => variant.options[name] ?? [])),
];

// The product as staff left the form: the fields on the page replace the saved ones; anything
// the form doesn't show (colour photos, made-to-measure sizes) is kept as it was.
export function productFromForm(
  current: AdminProduct,
  form: FormData,
  uploaded: UploadedPhoto | null,
): { input: ProductInput; problems: string[] } {
  const problems: string[] = [];
  const optionNames = optionNamesFrom(form, current);

  const readRow = (prefix: string, fallbackTitle: string) => {
    const field = (name: string) => `${prefix}.${name}`;
    const options = Object.fromEntries(
      optionNames.flatMap((name) => {
        const value = text(form, field(`option.${name}`));
        return value ? [[name, value]] : [];
      }),
    );
    const price = pence(form, field('price'));
    const stock = whole(form, field('stock'));
    const weight = decimal(form, field('weight'));
    const coverage = decimal(form, field('coverage'));
    const title =
      text(form, field('title')) ?? (Object.values(options).join(' / ') || fallbackTitle);
    if (Number.isNaN(price)) problems.push(`Enter the price of ${title} in pounds, like 89.99`);
    if (Number.isNaN(stock)) problems.push(`Enter the stock of ${title} as a whole number`);
    if (Number.isNaN(weight) || Number.isNaN(coverage)) {
      problems.push(`Enter the weight and coverage of ${title} as numbers`);
    }
    return {
      title,
      options,
      sku: text(form, field('sku')),
      pricePence: price,
      stockQuantity: stock ?? 0,
      weightKg: weight,
      coverageM2: coverage,
    };
  };

  const kept = current.variants.flatMap((variant, index) =>
    form.get(`variant.${index}.remove`) === 'on'
      ? []
      : [{ ...variant, ...readRow(`variant.${index}`, variant.title) }],
  );
  const added = Array.from({ length: NEW_OPTION_ROWS }, (_, index) => `newVariant.${index}`)
    .filter((prefix) =>
      ['title', 'sku', 'price', ...optionNames.map((name) => `option.${name}`)].some((name) =>
        text(form, `${prefix}.${name}`),
      ),
    )
    .map((prefix) => ({ barcode: null, ...readRow(prefix, current.title) }));
  const variants = [...kept, ...added];
  if (variants.length === 0) problems.push('Keep at least one option, so the product can be sold');

  const images = current.images
    .map((image, index) => ({
      ...image,
      alt: text(form, `image.${index}.alt`) ?? '',
      shows: photoShowsFrom(form, `image.${index}.shows`),
    }))
    .filter((_, index) => form.get(`image.${index}.remove`) !== 'on');
  if (uploaded) {
    images.push({
      url: uploaded.url,
      width: uploaded.width,
      height: uploaded.height,
      alt: text(form, 'newPhotoAlt') ?? '',
      shows: photoShowsFrom(form, 'newPhotoShows'),
    });
  }

  const minDays = whole(form, 'leadTimeMinDays');
  const maxDays = whole(form, 'leadTimeMaxDays');
  if (Number.isNaN(minDays) || Number.isNaN(maxDays))
    problems.push('Enter lead times in whole days');

  const colourSetId = text(form, 'colourSetId');
  const {
    id: _id,
    attributes: _attributes,
    pimSku: _pim,
    updatedAt: _updated,
    problems: _checks,
    ...unchanged
  } = current;
  return {
    problems,
    input: {
      ...unchanged,
      options: optionNames.map((title) => ({ title, values: valuesOf(variants, title) })),
      title: text(form, 'title') ?? '',
      handle: text(form, 'handle') ?? '',
      subtitle: text(form, 'subtitle'),
      brand: text(form, 'brand'),
      description: text(form, 'description'),
      published: form.get('published') === 'on',
      categoryId: text(form, 'categoryId'),
      pageType: (text(form, 'pageType') as ProductPageType | null) ?? null,
      stockMode: (text(form, 'stockMode') as StockMode | null) ?? current.stockMode,
      leadTimeMinDays: minDays,
      leadTimeMaxDays: maxDays,
      colourSetId,
      colourOption: colourSetId ? text(form, 'colourOption') : null,
      colourOptionValue: colourSetId ? text(form, 'colourOptionValue') : null,
      colourRequired: form.get('colourRequired') === 'on',
      variants,
      images,
    },
  };
}
