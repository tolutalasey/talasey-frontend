'use server';

import { redirect } from 'next/navigation';
import { uploadPhoto } from '@/features/admin';
import { done, failed, staffApi, text } from '@/features/staff';
import { dataFromForm, imagePaths, type Field, type Photo } from './fields';
import { fromLondonTime } from '@/lib/london-time';
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
  if (intent === 'release') {
    const releaseId = text(form, 'releaseId') ?? '';
    const { error } = await api.POST('/content/releases/{id}/items', {
      params: { path: { id: releaseId } },
      body: { documentId: id },
    });
    if (error) failed(page, problemText(error));
    done(page, 'Draft saved and added to the release. It goes live with the release.');
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

const RELEASES = '/content/releases/';

const releaseId = (form: FormData) => text(form, 'releaseId') ?? '';

export async function createRelease(form: FormData) {
  const { error } = await (
    await staffApi()
  ).POST('/content/releases', { body: { name: text(form, 'name') ?? '' } });
  if (error) failed(RELEASES, problemText(error));
  done(RELEASES, 'Release started. Add drafts to it from their edit pages.');
}

// One form per release, several buttons: schedule, publish now, unschedule or delete.
export async function changeRelease(form: FormData) {
  const api = await staffApi();
  const path = { params: { path: { id: releaseId(form) } } };
  const intent = text(form, 'intent');

  if (intent === 'schedule') {
    const publishAt = fromLondonTime(text(form, 'publishAt') ?? '');
    if (!publishAt) failed(RELEASES, 'Pick a date and time for the release');
    const { error } = await api.POST('/content/releases/{id}/schedule', {
      ...path,
      body: { publishAt: publishAt.toISOString() },
    });
    if (error) failed(RELEASES, problemText(error));
    done(RELEASES, 'Scheduled. Everything in it goes live together at that time.');
  }
  if (intent === 'unschedule') {
    const { error } = await api.POST('/content/releases/{id}/unschedule', path);
    if (error) failed(RELEASES, problemText(error));
    done(RELEASES, 'No longer scheduled. Nothing has changed on the site.');
  }
  if (intent === 'publish') {
    const { error } = await api.POST('/content/releases/{id}/publish', path);
    if (error) failed(RELEASES, `Nothing was published.\n${problemText(error)}`);
    done(RELEASES, 'Published. Everything in the release is on the site now.');
  }
  if (intent === 'delete') {
    const { error } = await api.DELETE('/content/releases/{id}', path);
    if (error) failed(RELEASES, problemText(error));
    done(RELEASES, 'Release deleted. The drafts in it are kept.');
  }
  failed(RELEASES, 'Choose what to do with the release');
}

export async function removeFromRelease(form: FormData) {
  const { error } = await (
    await staffApi()
  ).DELETE('/content/releases/{id}/items/{documentId}', {
    params: { path: { id: releaseId(form), documentId: text(form, 'documentId') ?? '' } },
  });
  if (error) failed(RELEASES, problemText(error));
  done(RELEASES, 'Taken out of the release. The draft is kept.');
}

// What is in the editor right now, for the live preview. Nothing is saved or logged, and photos
// chosen but not yet uploaded appear once the draft is saved.
export async function stagePreview(form: FormData): Promise<boolean> {
  const id = text(form, 'id') ?? '';
  const info = await typeInfo(text(form, 'type') ?? '');
  if (!info) return false;
  const { error } = await (
    await staffApi()
  ).PUT('/content/documents/{id}/preview', {
    params: { path: { id } },
    body: { data: dataFromForm(info.fields, form, {}) },
  });
  return !error;
}
