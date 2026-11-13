import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export const API_URL = process.env.API_URL ?? 'http://localhost:4000';

// The backend is its own project, checked out next to this one unless BACKEND_DIR says otherwise.
export const BACKEND_DIR = resolve(
  import.meta.dirname,
  '../..',
  process.env.BACKEND_DIR ?? '../talasey-backend',
);

// The product master sheet stays out of git. Journeys that need the full catalogue run when it
// has been copied to the backend's .data/pim and imported; the rest use the demo products.
export const MASTER_SHEET = resolve(
  BACKEND_DIR,
  '.data/pim/Talasey_Product_Master_Sheet_filled.xlsx',
);
export const hasCatalogue = existsSync(MASTER_SHEET);

export const DEMO_PASSWORD = 'talasey-demo';
export const PRODUCT_HANDLE = 'pavetuf-jointing-compound';
export const STOCKED_HANDLE = 'silver-grey-porcelain-paving';
// Only the admin journey changes this one, so other tests can rely on the rest staying put.
export const EDITABLE_HANDLE = 'porcelain-tile-spacers';
