import { execSync } from 'node:child_process';
import { BACKEND_DIR, hasCatalogue, MASTER_SHEET } from './stack.ts';

const inBackend = (command: string) => execSync(command, { stdio: 'inherit', cwd: BACKEND_DIR });

// The tests run against the real stack: migrations, the demo staff and products, and the master
// sheet when it is there. Each step is safe to repeat. Needs `pnpm db` running in the backend.
export default function globalSetup() {
  if (process.env.BASE_URL) return;
  inBackend('pnpm build');
  inBackend('pnpm db:migrate');
  inBackend('pnpm db:seed');
  if (hasCatalogue) inBackend(`pnpm catalogue:import "${MASTER_SHEET}"`);
}
