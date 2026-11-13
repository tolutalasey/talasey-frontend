// The field descriptions the API sends with each content type; the form is drawn from them.
export type Field =
  | {
      name: string;
      label: string;
      kind: 'text' | 'textarea' | 'date' | 'boolean' | 'list';
      help?: string;
    }
  | { name: string; label: string; kind: 'select'; options: string[]; help?: string }
  | { name: string; label: string; kind: 'group' | 'items'; fields: Field[]; help?: string }
  | { name: string; label: string; kind: 'image'; help?: string };

export type Data = Record<string, unknown>;

export interface Photo {
  src: string;
  width: number;
  height: number;
}

// One blank row after the saved ones, so a new item can be added without JavaScript.
export const EXTRA_ROWS = 1;

export const fieldPath = (prefix: string, name: string) => (prefix ? `${prefix}.${name}` : name);

const textOf = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim() : '';
};

const isEmpty = (value: unknown): boolean =>
  value === undefined ||
  value === false ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && value !== null && Object.values(value).every(isEmpty));

// Turns the posted form back into the document's data. Empty fields are left out, so the
// publishing checks can say what is missing; empty item rows are dropped.
export function dataFromForm(
  fields: Field[],
  form: FormData,
  photos: Record<string, Photo> = {},
  prefix = 'data',
): Data {
  const data: Data = {};
  for (const field of fields) {
    const path = fieldPath(prefix, field.name);
    const value = valueOf(field, form, photos, path);
    if (!isEmpty(value) || field.kind === 'boolean') data[field.name] = value;
  }
  return data;
}

function valueOf(
  field: Field,
  form: FormData,
  photos: Record<string, Photo>,
  path: string,
): unknown {
  switch (field.kind) {
    case 'boolean':
      return form.get(path) === 'on';
    case 'list':
      return textOf(form, path)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    case 'group':
      return dataFromForm(field.fields, form, photos, path);
    case 'items': {
      const rows: Data[] = [];
      for (let index = 0; form.has(`${path}.${index}.__row`); index++) {
        const row = dataFromForm(field.fields, form, photos, `${path}.${index}`);
        if (!isEmpty(row)) rows.push(row);
      }
      return rows;
    }
    case 'image': {
      const uploaded = photos[path];
      const src = uploaded?.src ?? textOf(form, `${path}.src`);
      if (!src) return undefined;
      return {
        src,
        alt: textOf(form, `${path}.alt`),
        width: uploaded?.width ?? Number(textOf(form, `${path}.width`)),
        height: uploaded?.height ?? Number(textOf(form, `${path}.height`)),
      };
    }
    default:
      return textOf(form, path) || undefined;
  }
}

// Every image field's path, for the files to upload before the form is read.
export function imagePaths(fields: Field[], form: FormData, prefix = 'data'): string[] {
  return fields.flatMap((field) => {
    const path = fieldPath(prefix, field.name);
    if (field.kind === 'image') return [path];
    if (field.kind === 'group') return imagePaths(field.fields, form, path);
    if (field.kind === 'items') {
      const paths: string[] = [];
      for (let index = 0; form.has(`${path}.${index}.__row`); index++) {
        paths.push(...imagePaths(field.fields, form, `${path}.${index}`));
      }
      return paths;
    }
    return [];
  });
}
