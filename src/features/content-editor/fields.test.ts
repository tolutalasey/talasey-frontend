import { describe, expect, it } from 'vitest';
import { dataFromForm, uploadPaths, type Field } from './fields';

const fields: Field[] = [
  { name: 'title', label: 'Title', kind: 'text' },
  { name: 'steps', label: 'Steps', kind: 'list' },
  { name: 'placeholder', label: 'Placeholder', kind: 'boolean' },
  {
    name: 'seo',
    label: 'Search',
    kind: 'group',
    fields: [{ name: 'title', label: 'Title', kind: 'text' }],
  },
  {
    name: 'faqs',
    label: 'FAQs',
    kind: 'items',
    fields: [
      { name: 'question', label: 'Question', kind: 'text' },
      { name: 'answer', label: 'Answer', kind: 'textarea' },
    ],
  },
  { name: 'photo', label: 'Photo', kind: 'image' },
];

const form = (entries: [string, string][]) => {
  const data = new FormData();
  for (const [name, value] of entries) data.append(name, value);
  return data;
};

describe('dataFromForm', () => {
  it('rebuilds nested data, lists and rows from the posted form', () => {
    const posted = form([
      ['data.title', ' Lighting a path '],
      ['data.steps', 'Plan\n\n Fit \n'],
      ['data.seo.title', 'Garden path lighting'],
      ['data.faqs.0.__row', ''],
      ['data.faqs.0.question', 'How far apart?'],
      ['data.faqs.0.answer', 'About a metre.'],
      ['data.faqs.1.__row', ''],
      ['data.faqs.1.question', ''],
      ['data.faqs.1.answer', ''],
      ['data.photo.src', '/uploads/a.jpg'],
      ['data.photo.alt', 'A lit path'],
      ['data.photo.width', '1200'],
      ['data.photo.height', '800'],
    ]);
    expect(dataFromForm(fields, posted)).toEqual({
      title: 'Lighting a path',
      steps: ['Plan', 'Fit'],
      placeholder: false,
      seo: { title: 'Garden path lighting' },
      faqs: [{ question: 'How far apart?', answer: 'About a metre.' }],
      photo: { src: '/uploads/a.jpg', alt: 'A lit path', width: 1200, height: 800 },
    });
  });

  it('leaves out what was left blank, so publishing can say what is missing', () => {
    expect(dataFromForm(fields, form([['data.title', ' ']]))).toEqual({ placeholder: false });
  });

  it('uses a newly uploaded photo', () => {
    const posted = form([['data.photo.alt', 'New']]);
    expect(
      dataFromForm(fields, posted, {
        'data.photo': { src: '/uploads/b.png', width: 10, height: 5 },
      }).photo,
    ).toEqual({ src: '/uploads/b.png', alt: 'New', width: 10, height: 5 });
    expect(uploadPaths(fields, posted)).toEqual([{ path: 'data.photo', kind: 'image' }]);
  });
});
