import { env } from './env';

export const site = {
  name: 'Talasey',
  legalName: 'Talasey Ltd',
  url: env.SITE_URL,
  locale: 'en-GB',
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
