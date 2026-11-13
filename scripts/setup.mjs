import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const backendEnv = resolve(process.env.BACKEND_DIR ?? '../talasey-backend', '.env');
const target = '.env.local';

if (!existsSync(target)) {
  writeFileSync(target, readFileSync('.env.example', 'utf8'));
  console.log(`Created ${target}`);
}

// The backend signs page refreshes with this secret, so both sides need the same one.
const secret = existsSync(backendEnv)
  ? /^REVALIDATE_SECRET=(.+)$/m.exec(readFileSync(backendEnv, 'utf8'))?.[1]
  : undefined;

if (!secret) {
  console.warn(
    `No REVALIDATE_SECRET in ${backendEnv}. Run \`pnpm setup\` in the backend first, then here again.`,
  );
} else {
  const env = readFileSync(target, 'utf8');
  if (!env.includes(`REVALIDATE_SECRET=${secret}`)) {
    writeFileSync(
      target,
      /^REVALIDATE_SECRET=.*$/m.test(env)
        ? env.replace(/^REVALIDATE_SECRET=.*$/m, `REVALIDATE_SECRET=${secret}`)
        : `${env.trimEnd()}\nREVALIDATE_SECRET=${secret}\n`,
    );
    console.log('Matched REVALIDATE_SECRET to the backend.');
  }
}

console.log(
  [
    '',
    'Done. With the backend running, start the site with `pnpm dev`:',
    '  site     http://localhost:3000',
    '  admin    http://localhost:3000/admin',
    '  content  http://localhost:3000/content',
    '  sign in as owner@, catalogue@, editor@ or contributor@talasey.local, password talasey-demo',
  ].join('\n'),
);
