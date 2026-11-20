// The simple formatting editors use in a page's text: a blank line between paragraphs, "## " for
// a heading, "- " for a bullet, [text](address) for a link, **text** for bold and
// ![description](https://…) on a line of its own for a picture. Nothing else is treated as
// markup, so the text can never inject HTML.

export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'link'; text: string; href: string };

export type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'image'; alt: string; src: string }
  | { kind: 'paragraph'; parts: Inline[] }
  | { kind: 'list'; items: Inline[][] };

const SAFE_HREF = /^(\/(?!\/)|https:\/\/|mailto:|tel:)/;
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

export function inline(text: string): Inline[] {
  const parts: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ kind: 'text', text: text.slice(last, start) });
    const [whole, label, href, bold] = match;
    if (bold) parts.push({ kind: 'bold', text: bold });
    else if (label && href && SAFE_HREF.test(href)) parts.push({ kind: 'link', text: label, href });
    else parts.push({ kind: 'text', text: label ?? whole });
    last = start + whole.length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) });
  return parts;
}

const BULLET = /^[-*•]\s+/;
const IMAGE = /^!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)$/;

export function blocks(body: string): Block[] {
  return body
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .flatMap((chunk): Block[] => {
      if (chunk.startsWith('#')) return [{ kind: 'heading', text: chunk.replace(/^#+\s*/, '') }];
      const picture = IMAGE.exec(chunk);
      if (picture) return [{ kind: 'image', alt: picture[1] ?? '', src: picture[2] ?? '' }];
      const lines = chunk.split('\n').map((line) => line.trim());
      if (lines.every((line) => BULLET.test(line))) {
        return [{ kind: 'list', items: lines.map((line) => inline(line.replace(BULLET, ''))) }];
      }
      return [{ kind: 'paragraph', parts: inline(lines.join(' ')) }];
    });
}
