'use server';

import { redirect } from 'next/navigation';
import { uploadPhoto } from '@/features/admin';
import { done, failed, staffApi, text } from '@/features/staff';
import { dataFromForm, imagePaths, type Field, type Photo } from './fields';
import type { ContentTypeInfo } from './types';

const problemText = (error: unknown) => {
  const message = (error as { message?: unknown } | undefined)?.message;
  return Array.isArray(message)
    ? message.join('\n')
    : String(message ?? 'That did not work. Try again.');
};

async function typeInfo(type: string): Promise<ContentTypeInfo | undefined> {
  const { data = [] } = await (await staffApi()).GET('/content/types');
  return (data as ContentTypeInfo[]).find((entry) => entry.type === type);
}

async function formData(fields: Field[], form: FormData, page: string) {
  const photos: Record<string, Photo> = {};
  for (const path of imagePaths(fields, form)) {
    const uploaded = await uploadPhoto(form, `${path}.file`);
    if (!uploaded.ok) failed(page, uploaded.problem);
    if (uploaded.photo) {
      photos[path] = {
        src: uploaded.photo.url,
        width: uploaded.photo.width,
        height: uploaded.photo.height,
      };
    }
  }
  return dataFromForm(fields, form, photos);
}

export async function createContent(form: FormData) {
  const type = text(form, 'type') ?? '';
  const info = await typeInfo(type);
  if (!info) failed('/content/', 'Unknown content type');
  const { data, error } = await (
    await staffApi()
  ).POST('/content/documents', {
    body: { type, data: { [info.fields[0]?.name ?? 'title']: text(form, 'name') ?? 'Untitled' } },
  });
  if (!data) failed(`/content/${type}/`, problemText(error));
  redirect(`/content/edit/${data.id}/`);
}

// One form, several buttons: save the draft, then publish or unpublish it if asked to.
export async function saveContent(form: FormData) {
  const id = text(form, 'id') ?? '';
  const page = `/content/edit/${id}/`;
  const intent = text(form, 'intent') ?? 'save';
  const api = await staffApi();
  const info = await typeInfo(text(form, 'type') ?? '');
  if (!info) failed('/content/', 'Unknown content type');

  if (intent === 'delete') {
    const { error } = await api.DELETE('/content/documents/{id}', { params: { path: { id } } });
    if (error) failed(page, problemText(error));
    done(`/content/${info.type}/`, 'Deleted. It can be brought back from the change log.');
  }

  const saved = await api.PUT('/content/documents/{id}', {
    params: { path: { id } },
    body: { data: await formData(info.fields, form, page) },
  });
  if (!saved.data) failed(page, problemText(saved.error));

  if (intent === 'publish') {
    const { error } = await api.POST('/content/documents/{id}/publish', {
      params: { path: { id } },
    });
    if (error) failed(page, problemText(error));
    done(page, 'Published. The site shows it now.');
  }
  if (intent === 'unpublish') {
    const { error } = await api.POST('/content/documents/{id}/unpublish', {
      params: { path: { id } },
    });
    if (error) failed(page, problemText(error));
    done(page, 'Taken off the site. The draft is kept.');
  }
  done(page, 'Draft saved. The site still shows the published version.');
}
