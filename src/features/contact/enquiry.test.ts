import { describe, expect, it } from 'vitest';
import { MAX_PHOTO_BYTES, parseEnquiry } from './enquiry';

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
