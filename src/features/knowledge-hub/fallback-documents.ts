import type { HubDocument } from './schemas';

// The documents on the current talasey.co.uk Knowledge Hub, until they are published in /content.
const UPLOADS = 'https://talasey.co.uk/wp-content/uploads/';

export const fallbackDocuments: HubDocument[] = [
  {
    slug: 'pavetuf-channel-drain-use-installation',
    title: 'Pavetuf Channel Drain Use & Installation',
    kind: 'Installation & Technical Guides',
    file: `${UPLOADS}2026/07/Pavetuf-Channel-Drain-Use-Installation_PTCDTG0822V4.pdf`,
    thumbnail: null,
    ranges: ['Installation'],
    products: [],
    publishedOn: '2026-05-05',
  },
  {
    slug: 'egyptian-limestone-galala-white-standard-specifications',
    title: 'Egyptian Limestone Galala White – Standard Specifications',
    kind: 'Specification Sheets',
    file: `${UPLOADS}2026/07/Standard-Specifications-Egyptian-Limestone-Galala-White_SSELGW0226.pdf`,
    thumbnail: null,
    ranges: ['Natural Stone'],
    products: [],
    publishedOn: '2026-05-01',
  },
  {
    slug: 'egyptian-limestone-sinai-pearl-standard-specifications',
    title: 'Egyptian Limestone Sinai Pearl – Standard Specifications',
    kind: 'Specification Sheets',
    file: `${UPLOADS}2026/07/Standard-Specifications-Egyptian-Limestone-Sinai-Pearl_SSELSP0226.pdf`,
    thumbnail: null,
    ranges: ['Natural Stone'],
    products: [],
    publishedOn: '2026-05-01',
  },
];
