import { expect, test } from '@playwright/test';
import { API_URL, DEMO_PASSWORD } from '../fixtures/stack.ts';

const run = Date.now().toString(36);

test('an editor puts two drafts live together through a release', async ({ page, request }) => {
  const { token } = await (
    await request.post(`${API_URL}/auth/sign-in`, {
      data: { email: 'editor@talasey.local', password: DEMO_PASSWORD },
    })
  ).json();
  const slugs = [`sale-patio-${run}`, `sale-decking-${run}`];
  for (const slug of slugs) {
    const created = await request.post(`${API_URL}/content/documents`, {
      headers: { authorization: `Bearer ${token}` },
      data: {
        type: 'guide',
        data: {
          title: `Guide ${slug}`,
          slug,
          topic: 'Planning',
          answer: 'Plan the area first, then order everything for the job in one go.',
          steps: ['Measure the area', 'Order the materials'],
          body: 'First paragraph.\n\nSecond paragraph.',
          author: { name: 'Sam Patel', role: 'Technical team' },
          publishedOn: '2026-11-01',
          seo: {
            title: 'How to plan your spring garden project | Talasey',
            description:
              'How to plan a spring garden project: measuring up, what to order and when, from our technical team.',
          },
        },
      },
    });
    expect(created.status()).toBe(201);
  }

  await page.goto('/content/sign-in/');
  await page.getByRole('textbox', { name: 'Email' }).fill('editor@talasey.local');
  await page.getByRole('textbox', { name: 'Password' }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/content\/$/);

  const releaseName = `Spring sale ${run}`;
  await page.goto('/content/releases/');
  await page.getByRole('textbox', { name: 'New release name' }).fill(releaseName);
  await page.getByRole('button', { name: 'Start a release' }).click();
  await expect(page.getByRole('heading', { name: releaseName })).toBeVisible();

  for (const slug of slugs) {
    await page.goto('/content/guide/');
    await page.getByRole('link', { name: `Guide ${slug}` }).click();
    await page.getByRole('combobox', { name: 'Release' }).selectOption({ label: releaseName });
    await page.getByRole('button', { name: 'Save and add to release' }).click();
    await expect(page.getByText(`Waiting in the release ${releaseName}`)).toBeVisible();
    expect((await page.request.get(`/guides/${slug}/`)).status()).toBe(404);
  }

  await page.goto('/content/releases/');
  const release = page.getByRole('region', { name: releaseName });
  await release.getByRole('button', { name: 'Publish everything now' }).click();
  await expect(page.getByText('Everything in the release is on the site now')).toBeVisible();

  for (const slug of slugs) {
    await expect.poll(async () => (await page.request.get(`/guides/${slug}/`)).status()).toBe(200);
  }
});
