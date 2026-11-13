import { Checkbox, SelectField, TextAreaField, TextField } from '@/ui';
import { staffStyles as styles } from '@/features/staff';
import { EXTRA_ROWS, fieldPath, type Data, type Field } from '../fields';

interface Props {
  fields: Field[];
  data: Data;
  prefix?: string;
}

const asText = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : '';
const asList = (value: unknown) => (Array.isArray(value) ? value.join('\n') : '');
const asData = (value: unknown): Data =>
  value && typeof value === 'object' ? (value as Data) : {};

// Draws the editing form from the content type's field descriptions.
export function ContentFields({ fields, data, prefix = 'data' }: Props) {
  return (
    <div className={styles.stack}>
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={data[field.name]}
          path={fieldPath(prefix, field.name)}
        />
      ))}
    </div>
  );
}

function FieldInput({ field, value, path }: { field: Field; value: unknown; path: string }) {
  switch (field.kind) {
    case 'text':
      return (
        <TextField
          label={field.label}
          name={path}
          defaultValue={asText(value)}
          description={field.help}
        />
      );
    case 'date':
      return (
        <TextField
          label={field.label}
          name={path}
          type="date"
          defaultValue={asText(value)}
          description={field.help}
        />
      );
    case 'textarea':
      return (
        <TextAreaField
          label={field.label}
          name={path}
          defaultValue={asText(value)}
          description={field.help}
        />
      );
    case 'list':
      return (
        <TextAreaField
          label={field.label}
          name={path}
          rows={4}
          defaultValue={asList(value)}
          description={field.help ?? 'One per line'}
        />
      );
    case 'boolean':
      return (
        <Checkbox name={path} defaultSelected={value === true} description={field.help}>
          {field.label}
        </Checkbox>
      );
    case 'select':
      return (
        <SelectField
          label={field.label}
          name={path}
          options={field.options}
          defaultValue={asText(value)}
          emptyLabel="Choose one"
          description={field.help}
        />
      );
    case 'group':
      return (
        <fieldset className={styles.panel}>
          <legend>{field.label}</legend>
          {field.help && <p className={styles.muted}>{field.help}</p>}
          <ContentFields fields={field.fields} data={asData(value)} prefix={path} />
        </fieldset>
      );
    case 'items': {
      const rows = Array.isArray(value) ? (value as Data[]) : [];
      return (
        <fieldset className={styles.panel}>
          <legend>{field.label}</legend>
          {field.help && <p className={styles.muted}>{field.help}</p>}
          {[...rows, ...Array.from({ length: EXTRA_ROWS }, () => ({}))].map((row, index) => (
            <fieldset key={index} className={styles.panel}>
              <legend>
                {index < rows.length ? `${index + 1}` : 'Add another (leave empty to skip)'}
              </legend>
              <input type="hidden" name={`${path}.${index}.__row`} value="" />
              <ContentFields fields={field.fields} data={row} prefix={`${path}.${index}`} />
            </fieldset>
          ))}
          <p className={styles.muted}>To remove one, empty its fields and save.</p>
        </fieldset>
      );
    }
    case 'image': {
      const photo = asData(value);
      return (
        <fieldset className={styles.panel}>
          <legend>{field.label}</legend>
          {typeof photo.src === 'string' && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- staff preview, never on the shop */}
              <img src={photo.src} alt="" className={styles.thumb} />
              <input type="hidden" name={`${path}.src`} value={photo.src} />
              <input type="hidden" name={`${path}.width`} value={asText(photo.width)} />
              <input type="hidden" name={`${path}.height`} value={asText(photo.height)} />
            </>
          )}
          <label htmlFor={`${path}.file`}>
            {photo.src ? 'Replace the photo' : 'Choose a photo'}
          </label>
          <input
            id={`${path}.file`}
            name={`${path}.file`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
          />
          <TextField
            label="Description"
            name={`${path}.alt`}
            defaultValue={asText(photo.alt)}
            description="What it shows, for people who can't see it"
          />
        </fieldset>
      );
    }
  }
}
