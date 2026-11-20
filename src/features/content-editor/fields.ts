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
  | { name: string; label: string; kind: 'image' | 'file'; help?: string };

export type Data = Record<string, unknown>;

export interface Photo {
  src: string;
  width: number;
  height: number;
}

// Files chosen in the form and already stored: a photo's size, or a document's address.
export type Uploaded = Record<string, Photo | string>;

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
  uploaded: Uploaded = {},
  prefix = 'data',
): Data {
  const data: Data = {};
  for (const field of fields) {
    const path = fieldPath(prefix, field.name);
    const value = valueOf(field, form, uploaded, path);
    if (!isEmpty(value) || field.kind === 'boolean') data[field.name] = value;
  }
  return data;
}

function valueOf(field: Field, form: FormData, uploaded: Uploaded, path: string): unknown {
  switch (field.kind) {
    case 'boolean':
      return form.get(path) === 'on';
    case 'list':
      return textOf(form, path)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    case 'group':
      return dataFromForm(field.fields, form, uploaded, path);
    case 'items': {
      const rows: Data[] = [];
      for (let index = 0; form.has(`${path}.${index}.__row`); index++) {
        const row = dataFromForm(field.fields, form, uploaded, `${path}.${index}`);
        if (!isEmpty(row)) rows.push(row);
      }
      return rows;
    }
    case 'image': {
      if (form.get(`${path}.remove`) === 'on') return undefined;
      const photo = uploaded[path];
      const fresh = typeof photo === 'object' ? photo : undefined;
      const src = fresh?.src ?? textOf(form, `${path}.src`);
      if (!src) return undefined;
      return {
        src,
        alt: textOf(form, `${path}.alt`),
        width: fresh?.width ?? Number(textOf(form, `${path}.width`)),
        height: fresh?.height ?? Number(textOf(form, `${path}.height`)),
      };
    }
    case 'file': {
      const file = uploaded[path];
      return (typeof file === 'string' ? file : textOf(form, path)) || undefined;
    }
    default:
      return textOf(form, path) || undefined;
  }
}

// Every photo or document field's path, for the files to upload before the form is read.
export function uploadPaths(
  fields: Field[],
  form: FormData,
  prefix = 'data',
): { path: string; kind: 'image' | 'file' }[] {
  return fields.flatMap((field) => {
    const path = fieldPath(prefix, field.name);
    if (field.kind === 'image' || field.kind === 'file') return [{ path, kind: field.kind }];
    if (field.kind === 'group') return uploadPaths(field.fields, form, path);
    if (field.kind === 'items') {
      const paths: { path: string; kind: 'image' | 'file' }[] = [];
      for (let index = 0; form.has(`${path}.${index}.__row`); index++) {
        paths.push(...uploadPaths(field.fields, form, `${path}.${index}`));
      }
      return paths;
    }
    return [];
  });
}
