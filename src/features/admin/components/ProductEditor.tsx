import { Button, Checkbox, SelectField, Table, TextAreaField, TextField } from '@/ui';
import NextLink from 'next/link';
import { poundsText, staffStyles as styles } from '@/features/staff';
import { deleteProduct, saveProduct } from '../actions';
import {
  PAGE_TYPES,
  STOCK_MODES,
  type AdminProduct,
  type Category,
  type ColourSet,
} from '../types';

interface Props {
  product: AdminProduct;
  categories: Category[];
  colourSets: ColourSet[];
}

// Everything staff change day to day on one page. Fields left blank mean "not set".
export function ProductEditor({ product, categories, colourSets }: Props) {
  const optionNames = product.options.map((option) => option.title);
  return (
    <>
      <form action={saveProduct} encType="multipart/form-data" className={styles.stack}>
        <input type="hidden" name="id" value={product.id} />
        <section className={styles.panel} aria-labelledby="details">
          <h2 id="details">Details</h2>
          <div className={styles.stack}>
            <TextField label="Name" name="title" defaultValue={product.title} isRequired />
            <TextField
              label="Web address"
              name="handle"
              defaultValue={product.handle}
              description={`The shop shows it at /products/${product.handle}/. Changing it changes the link.`}
            />
            <TextField
              label="Short description"
              name="subtitle"
              defaultValue={product.subtitle ?? ''}
            />
            <TextField label="Brand" name="brand" defaultValue={product.brand ?? ''} />
            <TextAreaField
              label="Description"
              name="description"
              defaultValue={product.description ?? ''}
              rows={6}
            />
            <SelectField
              label="Category"
              name="categoryId"
              defaultValue={product.categoryId ?? ''}
              emptyLabel="No category"
              options={categories.map((category) => ({ value: category.id, label: category.name }))}
            />
            <Checkbox name="published" defaultSelected={product.published}>
              Show on the shop
            </Checkbox>
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="prices">
          <h2 id="prices">Prices and stock</h2>
          <p className={styles.muted}>
            Prices include VAT. Leave a price empty if the option isn&rsquo;t for sale yet.
          </p>
          <Table caption="Options">
            <thead>
              <tr>
                <th scope="col">Option</th>
                <th scope="col">SKU</th>
                <th scope="col">Price (£)</th>
                <th scope="col">In stock</th>
                <th scope="col">Weight (kg)</th>
                <th scope="col">Covers (m² per pack)</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((variant, index) => (
                <tr key={variant.id}>
                  <th scope="row">
                    <input
                      className={styles.cellInput}
                      name={`variant.${index}.title`}
                      defaultValue={variant.title}
                      aria-label="Option name"
                    />
                  </th>
                  <td>
                    <input
                      className={styles.cellInput}
                      name={`variant.${index}.sku`}
                      defaultValue={variant.sku ?? ''}
                      aria-label={`SKU for ${variant.title}`}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.cellInput}
                      name={`variant.${index}.price`}
                      defaultValue={poundsText(variant.pricePence)}
                      inputMode="decimal"
                      aria-label={`Price for ${variant.title} in pounds`}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.cellInput}
                      name={`variant.${index}.stock`}
                      defaultValue={String(variant.stockQuantity)}
                      inputMode="numeric"
                      aria-label={`Stock for ${variant.title}`}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.cellInput}
                      name={`variant.${index}.weight`}
                      defaultValue={variant.weightKg ?? ''}
                      inputMode="decimal"
                      aria-label={`Weight of ${variant.title} in kilograms`}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.cellInput}
                      name={`variant.${index}.coverage`}
                      defaultValue={variant.coverageM2 ?? ''}
                      inputMode="decimal"
                      aria-label={`Square metres covered by one ${variant.title}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className={styles.row}>
            <SelectField
              label="Stock"
              name="stockMode"
              defaultValue={product.stockMode}
              options={STOCK_MODES}
            />
            <TextField
              label="Lead time from (days)"
              name="leadTimeMinDays"
              defaultValue={product.leadTimeMinDays?.toString() ?? ''}
              inputMode="numeric"
            />
            <TextField
              label="to (days)"
              name="leadTimeMaxDays"
              defaultValue={product.leadTimeMaxDays?.toString() ?? ''}
              inputMode="numeric"
            />
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="photos">
          <h2 id="photos">Photos</h2>
          {product.images.length === 0 && (
            <p>No photos yet. The shop shows a &ldquo;photo coming soon&rdquo; picture.</p>
          )}
          {product.images.map((image, index) => (
            <div key={image.url} className={styles.row}>
              {/* eslint-disable-next-line @next/next/no-img-element -- staff thumbnails, never on the shop */}
              <img src={image.url} alt="" className={styles.thumb} />
              <TextField
                label={`Photo ${index + 1} description`}
                name={`image.${index}.alt`}
                defaultValue={image.alt}
                description="What the photo shows, for people who can't see it"
              />
              <Checkbox name={`image.${index}.remove`}>Remove</Checkbox>
            </div>
          ))}
          <div className={styles.row}>
            <div>
              <label htmlFor="newPhoto">Add a photo (JPEG, PNG or WebP, up to 10 MB)</label>
              <br />
              <input
                id="newPhoto"
                name="newPhoto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
              />
            </div>
            <TextField label="New photo description" name="newPhotoAlt" />
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="page">
          <h2 id="page">How it sells</h2>
          <div className={styles.stack}>
            <SelectField
              label="Page type"
              name="pageType"
              defaultValue={product.pageType ?? ''}
              emptyLabel="Not set up yet"
              options={PAGE_TYPES}
            />
            <SelectField
              label="Colour set (page type 1B)"
              name="colourSetId"
              defaultValue={product.colourSetId ?? ''}
              emptyLabel="No colour choice"
              options={colourSets.map((set) => ({ value: set.id, label: set.name }))}
            />
            <div className={styles.row}>
              <SelectField
                label="Show the colours when"
                name="colourOption"
                defaultValue={product.colourOption ?? ''}
                emptyLabel="Always"
                options={optionNames}
              />
              <TextField
                label="is"
                name="colourOptionValue"
                defaultValue={product.colourOptionValue ?? ''}
                description="Like Powder coated"
              />
            </div>
            <Checkbox name="colourRequired" defaultSelected={product.colourRequired}>
              Shoppers must choose a colour
            </Checkbox>
          </div>
        </section>

        {product.problems.length > 0 && (
          <section className={styles.problem} aria-labelledby="checks">
            <h2 id="checks">SKU checks</h2>
            <ul>
              {product.problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </section>
        )}

        <div className={styles.actions}>
          <Button type="submit">Save</Button>
          <NextLink href={`/products/${product.handle}/`}>See it on the shop</NextLink>
          <NextLink href={`/admin/log/?subject=product&subjectId=${product.id}`}>History</NextLink>
        </div>
      </form>

      <form action={deleteProduct} className={`${styles.panel} ${styles.row}`}>
        <input type="hidden" name="id" value={product.id} />
        <Checkbox name="confirm">Yes, delete this product</Checkbox>
        <Button type="submit" variant="secondary">
          Delete
        </Button>
      </form>
    </>
  );
}
