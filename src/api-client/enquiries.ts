import { createApiClient, unwrap, type ApiClientOptions } from './client';
import type { paths } from './schema';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;

export type Enquiry = Json<paths['/admin/enquiries/{id}']['get']['responses'][200]>;
export type EnquiryStatus = Enquiry['status'];

// Contact messages and site survey requests, sent with their photos as one form. Staff read them
// through the admin with their own session.
export function createEnquiriesClient(options: ApiClientOptions) {
  const api = createApiClient(options);
  return {
    submit: (form: FormData) =>
      unwrap(
        api.POST('/store/enquiries', {
          body: form as never,
          bodySerializer: (body: unknown) => body as FormData,
        }),
      ),
  };
}

export type EnquiriesClient = ReturnType<typeof createEnquiriesClient>;
