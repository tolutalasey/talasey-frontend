import 'server-only';
import type { ContentTypeInfo } from '@/features/content-editor';
import { staffApi } from '@/features/staff';

export async function contentTypes(): Promise<ContentTypeInfo[]> {
  const { data = [] } = await (await staffApi()).GET('/content/types');
  return data as ContentTypeInfo[];
}
