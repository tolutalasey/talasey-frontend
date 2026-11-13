import type { Enquiry, EnquiryPhoto } from './enquiry';

// Where contact form enquiries go. Locally they are files on disk; the CRM adapter replaces this
// when the CRM is chosen (PRD section 10).
export interface EnquiryStore {
  readonly name: string;
  save(enquiry: Enquiry, photos: EnquiryPhoto[]): Promise<{ id: string }>;
}
