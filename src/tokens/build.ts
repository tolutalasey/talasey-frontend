import { writeFileSync } from 'node:fs';
import { toCssVariables } from './css';
import { tokens } from './tokens';

writeFileSync(new URL('tokens.css', import.meta.url), toCssVariables(tokens));
