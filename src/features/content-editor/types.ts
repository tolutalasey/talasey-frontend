import type { paths } from '@/api-client';
import type { Field } from './fields';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;

export type ContentTypeInfo = Omit<
  Json<paths['/content/types']['get']['responses'][200]>[number],
  'fields'
> & { fields: Field[] };
export type ContentSummary = Json<paths['/content/documents']['get']['responses'][200]>[number];
export type ContentDocument = Json<paths['/content/documents/{id}']['get']['responses'][200]>;
