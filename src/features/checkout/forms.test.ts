import { describe, expect, it } from 'vitest';
import {
  parseAccessAnswers,
  parseBasketRequest,
  parseDeliveryDetails,
  parseQuantity,
} from './forms';

const form = (values: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(values)) data.set(name, value);
  return data;
};

const details = {
  email: 'amy@example.com',
  firstName: 'Amy',
  lastName: 'Shopper',
  address1: '1 Piccadilly',
  city: 'Manchester',
  postcode: 'm1 1ae',
  phone: '0161 000 0000',
};

describe('parseDeliveryDetails', () => {
  it('splits the email from the address and tidies the postcode', () => {
    const { email, ...address } = details;
    expect(parseDeliveryDetails(form(details))).toEqual({
      ok: true,
      value: { email, address: { ...address, postcode: 'M1 1AE' } },
    });
  });

  it('explains each missing or wrong field', () => {
    const result = parseDeliveryDetails(form({ ...details, postcode: '123', firstName: ' ' }));
    expect(result).toEqual({
      ok: false,
      state: {
        fieldErrors: {
          firstName: 'Enter your first name',
          postcode: 'Enter a UK postcode, like M1 1AE',
        },
      },
    });
  });
});

describe('parseAccessAnswers', () => {
  it('turns yes and no into true and false', () => {
    expect(
      parseAccessAnswers(form({ vehicleAccess: 'rigid', hardStanding: 'yes', kerbsideOk: 'no' })),
    ).toEqual({
      ok: true,
      value: { vehicleAccess: 'rigid', hardStanding: true, kerbsideOk: false },
    });
  });

  it('asks for every answer', () => {
    const result = parseAccessAnswers(form({ hardStanding: 'yes' }));
    expect(result.ok || Object.keys(result.state.fieldErrors ?? {})).toEqual([
      'vehicleAccess',
      'kerbsideOk',
    ]);
  });
});

describe('parseQuantity', () => {
  it('accepts whole numbers from 1', () => {
    expect(parseQuantity(form({ quantity: '3' }))).toEqual({ ok: true, value: 3 });
    expect(parseQuantity(form({ quantity: '0' }))).toEqual({
      ok: false,
      state: { fieldErrors: { quantity: 'Enter at least 1' } },
    });
  });
});

describe('parseBasketRequest', () => {
  const formOf = (entries: [string, string][]) => {
    const data = new FormData();
    for (const [name, value] of entries) data.append(name, value);
    return data;
  };

  it('reads the variant, packs, colour and ticked extras', () => {
    expect(
      parseBasketRequest(
        formOf([
          ['variantId', 'variant_pc'],
          ['quantity', '2'],
          ['colourId', 'col_1'],
          ['colourName:col_1', 'Anthracite grey (RAL 7016)'],
          ['colourName:col_2', 'Jet black (RAL 9005)'],
          ['extra', 'variant_jointing'],
        ]),
      ),
    ).toEqual({
      ok: true,
      value: {
        variantId: 'variant_pc',
        quantity: 2,
        colour: { id: 'col_1', name: 'Anthracite grey (RAL 7016)' },
        extras: ['variant_jointing'],
      },
    });
  });

  it('turns an area into whole packs', () => {
    const parsed = parseBasketRequest(
      formOf([
        ['variantId', 'v'],
        ['quantity', '1'],
        ['area', '14.4'],
        ['coverage', '1.44'],
        ['wastage', '10'],
      ]),
    );
    expect(parsed.ok && parsed.value.quantity).toBe(11);
  });

  it('asks for a colour when the set is required', () => {
    expect(
      parseBasketRequest(
        formOf([
          ['variantId', 'v'],
          ['quantity', '1'],
          ['colourRequired', 'true'],
          ['colourLabel', 'powder coat colour'],
        ]),
      ),
    ).toEqual({ ok: false, state: { fieldErrors: { colourId: 'Choose a powder coat colour' } } });
  });

  it('never adds an extra nobody ticked', () => {
    const parsed = parseBasketRequest(
      formOf([
        ['variantId', 'v'],
        ['quantity', '1'],
      ]),
    );
    expect(parsed.ok && parsed.value.extras).toEqual([]);
  });

  it('says what to do when no option can be bought', () => {
    expect(parseBasketRequest(formOf([['quantity', '1']]))).toEqual({
      ok: false,
      state: { message: 'Choose the options you want first.' },
    });
  });
});
