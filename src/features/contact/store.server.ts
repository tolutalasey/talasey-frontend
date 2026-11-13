import 'server-only';
import { join } from 'node:path';
import type { EnquiryStore } from './enquiry-store';
import { LocalEnquiryStore } from './local-enquiry-store';

export function enquiryStoreFromEnv(env = process.env): EnquiryStore {
  const directory = env.ENQUIRY_DIR ?? '.data/enquiries';
  // Runtime data, not part of the build: keeps the bundler from tracing the whole project.
  return new LocalEnquiryStore(join(/* turbopackIgnore: true */ process.cwd(), directory));
}
