'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { done, failed, lines, pence, staffApi, text, whole } from '@/features/staff';
import { productFromForm } from './product-form';
import { promotionFromForm } from './promotion-form';
import { uploadPhoto } from './upload.server';

const messageOf = (error: unknown) =>
  (error as { message?: unknown } | undefined)?.message instanceof Array
    ? (error as { message: string[] }).message.join('\n')
    : String(
        (error as { message?: unknown } | undefined)?.message ?? 'That did not work. Try again.',
      );

const id = (form: FormData) => text(form, 'id') ?? '';

export async function createProduct(form: FormData) {
  const api = await staffApi();
  const { data, error } = await api.POST('/admin/products', {
    body: { title: text(form, 'title') ?? '' },
  });
  if (!data) failed('/admin/products/', messageOf(error));
  redirect(
    `/admin/products/${data.id}/?message=${encodeURIComponent('Product created. Add its details, then publish it.')}`,
  );
}

export async function saveProduct(form: FormData) {
  const productId = id(form);
  const page = `/admin/products/${productId}/`;
  const api = await staffApi();
  const { data: current } = await api.GET('/admin/products/{id}', {
    params: { path: { id: productId } },
  });
  if (!current) failed('/admin/products/', 'That product no longer exists');

  const upload = await uploadPhoto(form, 'newPhoto');
  if (!upload.ok) failed(page, upload.problem);
  const { input, problems } = productFromForm(current, form, upload.photo);
  if (problems.length > 0) failed(page, problems.join('\n'));

  const { error } = await api.PUT('/admin/products/{id}', {
    params: { path: { id: productId } },
    body: input,
  });
  if (error) failed(page, messageOf(error));
  revalidatePath('/admin/products/');
  done(
    page,
    input.published
      ? 'Saved. The shop shows the change now.'
      : 'Saved. The product is not published yet.',
  );
}

export async function deleteProduct(form: FormData) {
  const productId = id(form);
  if (form.get('confirm') !== 'on')
    failed(`/admin/products/${productId}/`, 'Tick the box to confirm the delete');
  const api = await staffApi();
  const { error } = await api.DELETE('/admin/products/{id}', {
    params: { path: { id: productId } },
  });
  if (error) failed(`/admin/products/${productId}/`, messageOf(error));
  done('/admin/products/', 'Product deleted. You can bring it back from the change log.');
}

const coloursFrom = (form: FormData) =>
  lines(text(form, 'colours')).map((line) => {
    const [name = '', hex = ''] = line.split(',').map((part) => part.trim());
    const existing = text(form, `colourId:${name.toLowerCase()}`);
    return { name, hex, photoUrl: null, ...(existing && { id: existing }) };
  });

export async function saveColourSet(form: FormData) {
  const setId = text(form, 'id');
  const body = { name: text(form, 'name') ?? '', colours: coloursFrom(form) };
  const api = await staffApi();
  const result = setId
    ? await api.PUT('/admin/colour-sets/{id}', { params: { path: { id: setId } }, body })
    : await api.POST('/admin/colour-sets', { body });
  const page = setId ? `/admin/colour-sets/${setId}/` : '/admin/colour-sets/';
  if (!result.data) failed(page, messageOf(result.error));
  done(`/admin/colour-sets/${result.data.id}/`, 'Colour set saved.');
}

export async function deleteColourSet(form: FormData) {
  const api = await staffApi();
  const { error } = await api.DELETE('/admin/colour-sets/{id}', {
    params: { path: { id: id(form) } },
  });
  if (error) failed(`/admin/colour-sets/${id(form)}/`, messageOf(error));
  done('/admin/colour-sets/', 'Colour set deleted.');
}

export async function refundOrder(form: FormData) {
  const orderId = id(form);
  const amountPence = pence(form, 'amount');
  const page = `/admin/orders/${orderId}/`;
  if (!amountPence || Number.isNaN(amountPence))
    failed(page, 'Enter the amount to refund, like 65.00');
  const api = await staffApi();
  const { error } = await api.POST('/admin/orders/{id}/refunds', {
    params: { path: { id: orderId } },
    body: { amountPence },
  });
  if (error) failed(page, messageOf(error));
  done(page, 'Refunded.');
}

export async function saveZone(form: FormData) {
  const zone = text(form, 'zone') ?? '';
  const page = `/admin/delivery/${zone}/`;
  const rates = lines(text(form, 'rates')).map((line) => {
    const [shipment = '', maxWeight = '', price = ''] = line.split(',').map((part) => part.trim());
    return {
      shipment: shipment.toLowerCase() as 'pallet' | 'parcel',
      maxWeightKg: Number(maxWeight),
      pricePence: Math.round(Number(price.replace(/[£,]/g, '')) * 100),
    };
  });
  const palletsPerDay = whole(form, 'palletsPerDay');
  const leadTimeDays = whole(form, 'leadTimeDays');
  const api = await staffApi();
  const { error } = await api.PUT('/admin/delivery/zones/{zone}', {
    params: { path: { zone } },
    body: {
      areas: (text(form, 'areas') ?? '').split(/[\s,]+/).filter(Boolean),
      rates,
      palletsPerDay,
      leadTimeDays,
    },
  });
  if (error) failed(text(form, 'existing') ? page : '/admin/delivery/', messageOf(error));
  done(page, 'Delivery zone saved. New quotes use it straight away.');
}

export async function deleteZone(form: FormData) {
  const zone = text(form, 'zone') ?? '';
  const api = await staffApi();
  const { error } = await api.DELETE('/admin/delivery/zones/{zone}', {
    params: { path: { zone } },
  });
  if (error) failed(`/admin/delivery/${zone}/`, messageOf(error));
  done('/admin/delivery/', `${zone} deleted.`);
}

export async function restoreChange(form: FormData) {
  const back = text(form, 'back') ?? '/admin/log/';
  const api = await staffApi();
  const { error } = await api.POST('/admin/audit/{id}/restore', {
    params: { path: { id: id(form) } },
  });
  if (error) failed(back, messageOf(error));
  done(back, 'Put back as it was before that change.');
}

export async function createStaff(form: FormData) {
  const api = await staffApi();
  const { error } = await api.POST('/admin/users', {
    body: {
      email: text(form, 'email') ?? '',
      name: text(form, 'name') ?? '',
      role: (text(form, 'role') ?? 'contributor') as
        'owner' | 'editor' | 'contributor' | 'catalogue',
      password: text(form, 'password') ?? '',
    },
  });
  if (error) failed('/admin/users/', messageOf(error));
  done('/admin/users/', 'Account created. Give them their password in person.');
}

export async function updateStaff(form: FormData) {
  const api = await staffApi();
  const password = text(form, 'password');
  const { error } = await api.PATCH('/admin/users/{id}', {
    params: { path: { id: id(form) } },
    body: {
      role: (text(form, 'role') ?? undefined) as
        'owner' | 'editor' | 'contributor' | 'catalogue' | undefined,
      active: form.get('active') === 'on',
      ...(password && { password }),
      ...(form.get('resetTwoFactor') === 'on' && { twoFactor: false as const }),
    },
  });
  if (error) failed('/admin/users/', messageOf(error));
  done('/admin/users/', 'Account updated.');
}

const SAMPLES = '/admin/samples/';

export async function markSamplesSent(form: FormData) {
  const { error } = await (
    await staffApi()
  ).POST('/admin/samples/requests/{id}/dispatch', { params: { path: { id: id(form) } } });
  if (error) failed(SAMPLES, messageOf(error));
  done(SAMPLES, 'Marked as sent. The customer has an email to say they are on their way.');
}

export async function addSampleOffer(form: FormData) {
  const { error } = await (
    await staffApi()
  ).POST('/admin/samples/offers', {
    body: { productHandle: text(form, 'productHandle') ?? '', label: text(form, 'label') ?? '' },
  });
  if (error) failed(SAMPLES, messageOf(error));
  done(SAMPLES, 'Sample added. The shop offers it now.');
}

export async function changeSampleOffer(form: FormData) {
  const api = await staffApi();
  const path = { params: { path: { id: id(form) } } };
  if (form.get('intent') === 'delete') {
    const { error } = await api.DELETE('/admin/samples/offers/{id}', path);
    if (error) failed(SAMPLES, messageOf(error));
    done(SAMPLES, 'Sample removed.');
  }
  const { error } = await api.PATCH('/admin/samples/offers/{id}', {
    ...path,
    body: { active: form.get('intent') === 'start' },
  });
  if (error) failed(SAMPLES, messageOf(error));
  done(SAMPLES, form.get('intent') === 'start' ? 'Offered again.' : 'No longer offered.');
}

const PROMOTIONS = '/admin/promotions/';

export async function savePromotion(form: FormData) {
  const { promotion, problems } = promotionFromForm(form);
  if (problems.length > 0) failed(PROMOTIONS, problems.join('\n'));
  const api = await staffApi();
  const promotionId = id(form);
  const { error } = promotionId
    ? await api.PUT('/admin/promotions/{id}', {
        params: { path: { id: promotionId } },
        body: promotion,
      })
    : await api.POST('/admin/promotions', { body: promotion });
  if (error) failed(PROMOTIONS, messageOf(error));
  done(PROMOTIONS, promotionId ? 'Promotion saved.' : `${promotion.name} added.`);
}

export async function deletePromotion(form: FormData) {
  const { error } = await (
    await staffApi()
  ).DELETE('/admin/promotions/{id}', { params: { path: { id: id(form) } } });
  if (error) failed(PROMOTIONS, messageOf(error));
  done(PROMOTIONS, 'Promotion removed.');
}
