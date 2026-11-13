import 'server-only';
import { getContentClient } from './commerce';

// What the content team has published in /content. While the API is down the pages fall back to
// their built-in copy rather than failing.
export async function publishedContent(type: string): Promise<unknown[]> {
  try {
    return await getContentClient().published(type);
  } catch {
    return [];
  }
}
