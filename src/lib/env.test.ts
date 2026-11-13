import { describe, expect, it } from 'vitest';
import { parseEnv } from './env';

describe('parseEnv', () => {
  it('runs locally with no configuration', () => {
    expect(parseEnv({})).toMatchObject({
      APP_ENV: 'development',
      SITE_URL: 'http://localhost:3000',
    });
  });

  it('treats blank values as unset', () => {
    expect(parseEnv({ API_URL: '' }).API_URL).toBeUndefined();
  });

  it('requires the API and revalidation settings in production', () => {
    expect(() => parseEnv({ APP_ENV: 'production' })).toThrow(/API_URL[\s\S]*REVALIDATE_SECRET/);
  });

  it('rejects a short revalidation secret', () => {
    expect(() => parseEnv({ REVALIDATE_SECRET: 'short' })).toThrow(/REVALIDATE_SECRET/);
  });
});
