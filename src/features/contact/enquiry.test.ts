import { mkdtemp, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MAX_PHOTO_BYTES, parseEnquiry } from './enquiry';
import { LocalEnquiryStore } from './local-enquiry-store';

function enquiryForm(extra: [string, string | File][] = []) {
  const form = new FormData();
  for (const [name, value] of [
    ['name', 'Amy Shopper'],
    ['email', 'amy@example.com'],
    ['phone', ''],
    ['topic', 'quote'],
    ['orderNumber', ''],
    ['message', 'Can you price a 20 m² patio in silver grey?'],
    ...extra,
  ] as [string, string | File][]) {
    form.append(name, value);
  }
  return form;
}

const photo = (size: number, type = 'image/jpeg') =>
  new File([new Uint8Array(size)], 'garden.jpg', { type });

describe('parseEnquiry', () => {
  it('reads the enquiry and leaves optional fields empty', () => {
    const parsed = parseEnquiry(enquiryForm([['photos', photo(10)]]));
    expect(parsed).toMatchObject({
      ok: true,
      enquiry: { name: 'Amy Shopper', phone: null, topic: 'quote', orderNumber: null },
    });
    expect(parsed.ok && parsed.photos).toHaveLength(1);
  });

  it('ignores the empty file an unused photo field sends', () => {
    const parsed = parseEnquiry(enquiryForm([['photos', new File([], '')]]));
    expect(parsed.ok && parsed.photos).toEqual([]);
  });

  it('says what is wrong with each field', () => {
    const form = enquiryForm();
    form.set('email', 'not-an-email');
    form.set('message', 'Hi');
    expect(parseEnquiry(form)).toEqual({
      ok: false,
      state: {
        fieldErrors: {
          email: 'Enter an email address like name@example.com',
          message: 'Tell us a little more, at least 10 characters',
        },
      },
    });
  });

  it('refuses too many, too big or the wrong kind of photos', () => {
    const six = Array.from({ length: 6 }, () => ['photos', photo(10)] as [string, File]);
    expect(parseEnquiry(enquiryForm(six))).toMatchObject({
      state: { fieldErrors: { photos: 'Send up to 5 photos' } },
    });
    expect(parseEnquiry(enquiryForm([['photos', photo(MAX_PHOTO_BYTES + 1)]]))).toMatchObject({
      state: { fieldErrors: { photos: 'Each photo must be under 5 MB' } },
    });
    expect(parseEnquiry(enquiryForm([['photos', photo(10, 'application/pdf')]]))).toMatchObject({
      state: { fieldErrors: { photos: 'Send photos as JPEG, PNG, WebP or HEIC' } },
    });
  });
});

describe('LocalEnquiryStore', () => {
  it('saves the enquiry and its photos under names it chooses itself', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'enquiries-'));
    const store = new LocalEnquiryStore(directory, () => new Date('2026-11-13T09:00:00Z'));
    const { id } = await store.save(
      {
        name: 'Amy',
        email: 'amy@example.com',
        phone: null,
        topic: 'quote',
        orderNumber: null,
        message: 'Price a patio please',
      },
      [{ name: '../../etc/passwd', type: 'image/png', bytes: new Uint8Array([1, 2, 3]) }],
    );

    expect(id).toMatch(/^2026-11-13-[a-f0-9]{8}$/);
    expect((await readdir(join(directory, id))).sort()).toEqual(['enquiry.json', 'photo-1.png']);
    const saved = JSON.parse(await readFile(join(directory, id, 'enquiry.json'), 'utf8'));
    expect(saved).toMatchObject({
      id,
      receivedAt: '2026-11-13T09:00:00.000Z',
      topic: 'quote',
      photos: [{ file: 'photo-1.png', originalName: '../../etc/passwd', bytes: 3 }],
    });
  });
});
