// Tells Bing and the other IndexNow engines that pages changed (PRD section 13). Production uses
// the API; everywhere else does nothing, so local runs never contact a search engine.
export interface IndexNowNotifier {
  readonly name: string;
  notify(urls: string[]): Promise<void>;
}

export class NoIndexNow implements IndexNowNotifier {
  readonly name = 'off';

  async notify(): Promise<void> {}
}

export interface IndexNowOptions {
  key: string;
  siteUrl: string;
  fetch?: typeof fetch;
}

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10_000;

export const INDEXNOW_KEY_PATH = '/indexnow-key.txt';

export class IndexNowApi implements IndexNowNotifier {
  readonly name = 'IndexNow';

  constructor(private readonly options: IndexNowOptions) {}

  async notify(urls: string[]): Promise<void> {
    const { key, siteUrl, fetch: send = fetch } = this.options;
    const host = new URL(siteUrl).host;
    const urlList = [...new Set(urls)]
      .filter((url) => new URL(url).host === host)
      .slice(0, MAX_URLS);
    if (urlList.length === 0) return;
    const response = await send(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: new URL(INDEXNOW_KEY_PATH, siteUrl).href,
        urlList,
      }),
    });
    if (!response.ok && response.status !== 202) {
      throw new Error(`IndexNow refused the update (${response.status})`);
    }
  }
}

export function indexNowFromEnv(env: {
  APP_ENV: string;
  INDEXNOW_KEY?: string;
  SITE_URL: string;
}): IndexNowNotifier {
  if (env.APP_ENV !== 'production' || !env.INDEXNOW_KEY) return new NoIndexNow();
  return new IndexNowApi({ key: env.INDEXNOW_KEY, siteUrl: env.SITE_URL });
}
