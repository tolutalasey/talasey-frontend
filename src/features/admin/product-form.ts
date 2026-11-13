import { decimal, pence, text, whole } from '@/features/staff';
import type { AdminProduct, ProductInput } from './types';

type ProductPageType = ProductInput['pageType'];
type StockMode = ProductInput['stockMode'];

export interface UploadedPhoto {
  url: string;
  width: number;
  height: number;
}

// The product as staff left the form: the fields on the page replace the saved ones; anything
// the form doesn't show (options, colour photos, made-to-measure sizes) is kept as it was.
export function productFromForm(
  current: AdminProduct,
  form: FormData,
  uploaded: UploadedPhoto | null,
): { input: ProductInput; problems: string[] } {
  const problems: string[] = [];

  const variants = current.variants.map((variant, index) => {
    const field = (name: string) => `variant.${index}.${name}`;
    const price = pence(form, field('price'));
    const stock = whole(form, field('stock'));
    const weight = decimal(form, field('weight'));
    const coverage = decimal(form, field('coverage'));
    const title = text(form, field('title')) ?? variant.title;
    if (Number.isNaN(price)) problems.push(`Enter the price of ${title} in pounds, like 89.99`);
    if (Number.isNaN(stock)) problems.push(`Enter the stock of ${title} as a whole number`);
    if (Number.isNaN(weight) || Number.isNaN(coverage)) {
      problems.push(`Enter the weight and coverage of ${title} as numbers`);
    }
    return {
      ...variant,
      title,
      sku: text(form, field('sku')),
      pricePence: price,
      stockQuantity: stock ?? 0,
      weightKg: weight,
      coverageM2: coverage,
    };
  });

  const images = current.images
    .map((image, index) => ({ ...image, alt: text(form, `image.${index}.alt`) ?? '' }))
    .filter((_, index) => form.get(`image.${index}.remove`) !== 'on');
  if (uploaded) {
    images.push({
      url: uploaded.url,
      width: uploaded.width,
      height: uploaded.height,
      alt: text(form, 'newPhotoAlt') ?? '',
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
    ...kept
  } = current;
  return {
    problems,
    input: {
      ...kept,
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
