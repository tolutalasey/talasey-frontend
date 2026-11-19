import { Button } from '@/ui/Button/Button';
import { Checkbox } from '@/ui/Checkbox/Checkbox';
import { SelectField } from '@/ui/SelectField/SelectField';
import { Table } from '@/ui/Table/Table';
import { TextAreaField } from '@/ui/TextAreaField/TextAreaField';
import { TextField } from '@/ui/TextField/TextField';
import NextLink from 'next/link';
import { RulerIcon } from '@/ui/icons';
import {
  ExternalIcon,
  HistoryIcon,
  ImageIcon,
  money,
  poundsText,
  SaveBar,
  staffStyles as styles,
  TrashIcon,
} from '@/features/staff';
import { deleteProduct, saveProduct } from '../actions';
import { NEW_OPTION_ROWS, photoShowsChoices, photoShowsValue } from '../product-form';
import {
  PAGE_TYPES,
  STOCK_MODES,
  type AdminProduct,
  type Category,
  type ColourSet,
} from '../types';
import { VisibilitySwitch } from './VisibilitySwitch';

interface Props {
  product: AdminProduct;
  categories: Category[];
  colourSets: ColourSet[];
}

const FORM = 'product-form';

// Everything staff change day to day on one page. Fields left blank mean "not set".
export function ProductEditor({ product, categories, colourSets }: Props) {
  const optionNames = product.options.map((option) => option.title);
  const showsChoices = photoShowsChoices(product.options);
  const prices = product.variants
    .map((variant) => variant.pricePence)
    .filter((price): price is number => price !== null);
  const stock = product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);

  return (
    <div className={styles.editor}>
      <form
        id={FORM}
        action={saveProduct}
        encType="multipart/form-data"
        className={styles.editorMain}
      >
        <input type="hidden" name="id" value={product.id} />

        {product.problems.length > 0 && (
          <section className={styles.problem} aria-labelledby="checks">
            <div>
              <h2 id="checks">SKU checks</h2>
              <ul>
                {product.problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className={styles.panel} aria-labelledby="details">
          <h2 id="details">Details</h2>
          <p>The name and words shoppers see on the product page.</p>
          <div className={styles.fields}>
            <TextField label="Name" name="title" defaultValue={product.title} isRequired />
            <TextField label="Brand" name="brand" defaultValue={product.brand ?? ''} />
            <TextField
              label="Web address"
              name="handle"
              defaultValue={product.handle}
              description={`Shown at /products/${product.handle}/. Changing it changes the link.`}
            />
            <SelectField
              label="Category"
              name="categoryId"
              defaultValue={product.categoryId ?? ''}
              emptyLabel="No category"
              options={categories.map((category) => ({ value: category.id, label: category.name }))}
            />
            <div className={styles.wide}>
              <TextField
                label="Short description"
                name="subtitle"
                defaultValue={product.subtitle ?? ''}
              />
            </div>
            <div className={styles.wide}>
              <TextAreaField
                label="Description"
                name="description"
                defaultValue={product.description ?? ''}
                rows={6}
              />
            </div>
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="prices">
          <h2 id="prices">Prices and stock</h2>
          <p>Prices include VAT. Leave a price empty if the option isn&rsquo;t for sale yet.</p>
          <TextField
            label="Choices shoppers make"
            name="optionNames"
            defaultValue={optionNames.join(', ')}
            description="Separate them with commas, like Size, Colour. Each becomes a column below."
          />
          <Table caption="Options">
            <thead>
              <tr>
                <th scope="col">Option</th>
                {optionNames.map((name) => (
                  <th key={name} scope="col">
                    {name}
                  </th>
                ))}
                <th scope="col">SKU</th>
                <th scope="col">Price (£)</th>
                <th scope="col">In stock</th>
                <th scope="col">Weight (kg)</th>
                <th scope="col">m² per pack</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((variant, index) => (
                <OptionRow
                  key={variant.id}
                  prefix={`variant.${index}`}
                  optionNames={optionNames}
                  variant={variant}
                />
              ))}
              {Array.from({ length: NEW_OPTION_ROWS }, (_, index) => (
                <OptionRow
                  key={`new-${index}`}
                  prefix={`newVariant.${index}`}
                  optionNames={optionNames}
                />
              ))}
            </tbody>
          </Table>
          <p className={`${styles.muted} ${styles.small}`}>
            Fill in a blank row to add an option. Left blank, the option name is made from its
            choices, like 600 x 600 mm / Dove.
          </p>
          <hr className={styles.divider} />
          <div className={styles.fields}>
            <div className={styles.wide}>
              <SelectField
                label="Stock"
                name="stockMode"
                defaultValue={product.stockMode}
                options={STOCK_MODES}
              />
            </div>
            <TextField
              label="Lead time from (days)"
              name="leadTimeMinDays"
              defaultValue={product.leadTimeMinDays?.toString() ?? ''}
              inputMode="numeric"
            />
            <TextField
              label="Lead time to (days)"
              name="leadTimeMaxDays"
              defaultValue={product.leadTimeMaxDays?.toString() ?? ''}
              inputMode="numeric"
            />
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="photos">
          <h2 id="photos">Photos</h2>
          <p>
            The first photo leads on the shop. Describe each one for people who can&rsquo;t see it.
            Set what a photo shows, such as a colour, and the shop swaps to it when a customer picks
            that option.
          </p>
          <div className={styles.photos}>
            {product.images.map((image, index) => (
              <div key={image.url} className={styles.photo}>
                {/* eslint-disable-next-line @next/next/no-img-element -- staff thumbnails, never on the shop */}
                <img src={image.url} alt="" />
                <TextField
                  label={
                    index === 0 ? 'Main photo: what it shows' : `Photo ${index + 1}: what it shows`
                  }
                  name={`image.${index}.alt`}
                  defaultValue={image.alt}
                />
                {showsChoices.length > 0 && (
                  <SelectField
                    label="Shows"
                    name={`image.${index}.shows`}
                    options={showsChoices}
                    defaultValue={photoShowsValue(image.shows)}
                    emptyLabel="Every option"
                  />
                )}
                <Checkbox name={`image.${index}.remove`}>Remove when I save</Checkbox>
              </div>
            ))}
            <div className={styles.drop}>
              <ImageIcon />
              <label htmlFor="newPhoto">Add a photo</label>
              <span>JPEG, PNG or WebP, up to 10 MB</span>
              <input
                id="newPhoto"
                name="newPhoto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
              />
              <TextField label="What it shows" name="newPhotoAlt" />
              {showsChoices.length > 0 && (
                <SelectField
                  label="Shows"
                  name="newPhotoShows"
                  options={showsChoices}
                  emptyLabel="Every option"
                />
              )}
            </div>
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="page">
          <h2 id="page">How it sells</h2>
          <p>The kind of product page, and whether shoppers pick a colour.</p>
          <div className={styles.fields}>
            <div className={styles.wide}>
              <SelectField
                label="Page type"
                name="pageType"
                defaultValue={product.pageType ?? ''}
                emptyLabel="Not set up yet"
                options={PAGE_TYPES}
              />
            </div>
            <div className={styles.wide}>
              <SelectField
                label="Colour set (page type 1B)"
                name="colourSetId"
                defaultValue={product.colourSetId ?? ''}
                emptyLabel="No colour choice"
                options={colourSets.map((set) => ({ value: set.id, label: set.name }))}
              />
            </div>
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
            <div className={styles.wide}>
              <Checkbox name="colourRequired" defaultSelected={product.colourRequired}>
                Shoppers must choose a colour
              </Checkbox>
            </div>
          </div>
        </section>

        <SaveBar>
          <NextLink
            href={`/products/${product.handle}/`}
            className={styles.secondaryLink}
            target="_blank"
          >
            View on the shop
            <ExternalIcon />
          </NextLink>
          <Button type="submit">Save product</Button>
        </SaveBar>
      </form>

      <aside className={styles.aside} aria-label="About this product">
        <section className={styles.panel}>
          <h2 className={styles.asideTitle}>Visibility</h2>
          <VisibilitySwitch form={FORM} defaultChecked={product.published} />
        </section>

        <section className={styles.panel}>
          <h2 className={styles.asideTitle}>At a glance</h2>
          <dl className={styles.facts}>
            <div>
              <dt>Options</dt>
              <dd>{product.variants.length}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>
                {prices.length === 0
                  ? 'Not priced'
                  : Math.min(...prices) === Math.max(...prices)
                    ? money(Math.min(...prices))
                    : `${money(Math.min(...prices))} to ${money(Math.max(...prices))}`}
              </dd>
            </div>
            <div>
              <dt>In stock</dt>
              <dd>{stock}</dd>
            </div>
            <div>
              <dt>Photos</dt>
              <dd>{product.images.length}</dd>
            </div>
            <div>
              <dt>Page type</dt>
              <dd>{product.pageType ?? 'Not set up'}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.asideTitle}>More</h2>
          <ul className={styles.linkList}>
            {product.pageType === '2' && (
              <li>
                <NextLink href={`/admin/products/${product.id}/pricing/`}>
                  <RulerIcon />
                  Made-to-measure pricing
                </NextLink>
              </li>
            )}
            <li>
              <NextLink href={`/admin/log/?subject=product&subjectId=${product.id}`}>
                <HistoryIcon />
                History of changes
              </NextLink>
            </li>
            <li>
              <NextLink href={`/products/${product.handle}/`} target="_blank">
                <ExternalIcon />
                Open on the shop
              </NextLink>
            </li>
          </ul>
        </section>

        <form action={deleteProduct} className={`${styles.panel} ${styles.danger}`}>
          <h2 className={styles.asideTitle}>Delete</h2>
          <input type="hidden" name="id" value={product.id} />
          <div className={styles.stack}>
            <p className={`${styles.muted} ${styles.small}`}>
              Removes it from the shop and from this list.
            </p>
            <Checkbox name="confirm">Yes, delete this product</Checkbox>
            <button type="submit" className={styles.dangerButton}>
              <TrashIcon />
              Delete product
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

type Variant = AdminProduct['variants'][number];

interface OptionRowProps {
  prefix: string;
  optionNames: string[];
  variant?: Variant;
}

function OptionRow({ prefix, optionNames, variant }: OptionRowProps) {
  const name = variant?.title || 'the new option';
  const cell = (field: string, label: string, value: string, inputMode?: 'decimal' | 'numeric') => (
    <td>
      <input
        className={styles.cellInput}
        data-size={inputMode ? undefined : 'wide'}
        name={`${prefix}.${field}`}
        defaultValue={value}
        inputMode={inputMode}
        aria-label={label}
      />
    </td>
  );
  return (
    <tr>
      <th scope="row">
        <input
          className={styles.cellInput}
          name={`${prefix}.title`}
          defaultValue={variant?.title ?? ''}
          placeholder={variant ? undefined : 'New option'}
          data-size="wide"
          aria-label="Option name"
        />
      </th>
      {optionNames.map((option) =>
        cell(`option.${option}`, `${option} for ${name}`, variant?.options[option] ?? ''),
      )}
      {cell('sku', `SKU for ${name}`, variant?.sku ?? '')}
      {cell(
        'price',
        `Price for ${name} in pounds`,
        variant ? poundsText(variant.pricePence) : '',
        'decimal',
      )}
      {cell('stock', `Stock for ${name}`, variant ? String(variant.stockQuantity) : '', 'numeric')}
      {cell(
        'weight',
        `Weight of ${name} in kilograms`,
        variant?.weightKg?.toString() ?? '',
        'decimal',
      )}
      {cell(
        'coverage',
        `Square metres covered by one ${name}`,
        variant?.coverageM2?.toString() ?? '',
        'decimal',
      )}
      <td>
        {variant && (
          <input
            type="checkbox"
            name={`${prefix}.remove`}
            aria-label={`Remove ${name} when I save`}
          />
        )}
      </td>
    </tr>
  );
}
