import { absoluteUrl } from '../site';
import { productPath } from '../urls/keyword-map';

// The pages a revalidation tag stands for. Only product tags name a page; content tags cover
// many pages and are picked up by the sitemap instead.
export function changedUrls(tags: string[]): string[] {
  return tags.flatMap((tag) => {
    const [kind, handle] = tag.split(':');
    return kind === 'product' && handle ? [absoluteUrl(productPath(handle))] : [];
  });
}
