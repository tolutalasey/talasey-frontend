import { createHmac } from 'node:crypto';

// The code an authenticator app would show for a base32 key, so tests can sign in with
// two-factor the way a person would.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function decode(key: string): Buffer {
  const bits = [...key.replace(/\s/g, '')]
    .map((character) => ALPHABET.indexOf(character).toString(2).padStart(5, '0'))
    .join('');
  return Buffer.from(bits.match(/.{8}/g)?.map((byte) => parseInt(byte, 2)) ?? []);
}

export function codeFor(key: string, offsetSeconds = 0): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor((Date.now() / 1000 + offsetSeconds) / 30)));
  const hash = createHmac('sha1', decode(key)).update(counter).digest();
  const offset = (hash[hash.length - 1] ?? 0) & 0x0f;
  return String((hash.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}
