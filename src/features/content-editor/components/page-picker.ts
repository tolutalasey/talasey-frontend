// Links what is drawn in the preview to the form field it came from, by matching the words and
// photos on the page to the values in the form.

export const EDIT = 'data-edit-path';
const HOVER = 'data-edit-hover';
const PICKED = 'data-edit-picked';
const PICKABLE_KINDS = new Set(['text', 'textarea', 'list', 'image']);
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'svg']);

export interface Target {
  path: string;
  label: string;
  texts: string[];
  src?: string;
  // The words beside a photo in the same list row, such as its title, to tell apart two places
  // that use the same photo.
  nearby: string[];
}

const tidy = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();

const inputValue = (form: HTMLFormElement, name: string) => {
  const element = form.elements.namedItem(name);
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
    ? element.value
    : '';
};

export function targetsIn(form: HTMLFormElement): Target[] {
  return [...form.querySelectorAll<HTMLElement>('[data-field]')].flatMap((wrapper): Target[] => {
    const { field: path = '', kind = '', label = '' } = wrapper.dataset;
    if (!PICKABLE_KINDS.has(kind) || wrapper.closest('[data-extra]')) return [];
    if (kind === 'image') {
      const src = inputValue(form, `${path}.src`);
      const nearby = textsBeside(form, wrapper);
      return src ? [{ path, label, texts: [], src: sourceKey(src, document.baseURI), nearby }] : [];
    }
    const texts = textsOf(inputValue(form, path));
    return texts.length > 0 ? [{ path, label, texts, nearby: [] }] : [];
  });
}

const textsOf = (value: string) =>
  [value, ...value.split(/\n+/)].map(tidy).filter((text) => text.length > 1);

function textsBeside(form: HTMLFormElement, wrapper: HTMLElement): string[] {
  const row = wrapper.closest('[data-row]');
  if (!row) return [];
  return [...row.querySelectorAll<HTMLElement>('[data-kind=text], [data-kind=textarea]')].flatMap(
    (field) => textsOf(inputValue(form, field.dataset.field ?? '')),
  );
}

// next/image serves photos through /_next/image?url=…, so compare the photo it was asked for.
function sourceKey(src: string, base: string): string {
  try {
    const url = new URL(src, base);
    const original = /^\/_next\/image\/?$/.test(url.pathname) ? url.searchParams.get('url') : null;
    return original ? sourceKey(original, base) : `${url.host}${url.pathname}`;
  } catch {
    return src;
  }
}

// A heading usually beats a name with the same words, as the heading is what the page shows.
const weight = (target: Target) => (/heading|title/i.test(target.label) ? 1 : 0);

export function markPage(doc: Document, targets: Target[]) {
  const byText = new Map<string, Target>();
  for (const target of targets) {
    for (const text of target.texts) {
      const seen = byText.get(text);
      if (!seen || weight(target) > weight(seen)) byText.set(text, target);
    }
  }
  const bySource = new Map<string, Target[]>();
  for (const target of targets) {
    if (target.src) bySource.set(target.src, [...(bySource.get(target.src) ?? []), target]);
  }

  doc.querySelectorAll(`[${EDIT}]`).forEach((element) => element.removeAttribute(EDIT));
  for (const element of doc.body.querySelectorAll<HTMLElement>('*')) {
    if (SKIP_TAGS.has(element.tagName)) continue;
    if (element.tagName === 'IMG') {
      const image = element as HTMLImageElement;
      const found = bySource.get(sourceKey(image.currentSrc || image.src, doc.baseURI)) ?? [];
      const target = found.length === 1 ? found[0] : closestByWords(image, found);
      if (target) element.setAttribute(EDIT, target.path);
      continue;
    }
    const text = tidy(element.textContent ?? '');
    const target = byText.get(text);
    const sameAsChild = [...element.children].some(
      (child) => tidy(child.textContent ?? '') === text,
    );
    if (target && !sameAsChild) element.setAttribute(EDIT, target.path);
  }
}

// The row whose longest bit of text appears in this part of the page.
function bestMatch(text: string, targets: Target[]): Target | undefined {
  let best: Target | undefined;
  let longest = 0;
  for (const target of targets) {
    for (const words of target.nearby) {
      if (words.length > longest && text.includes(words)) {
        best = target;
        longest = words.length;
      }
    }
  }
  return best;
}

// The photo belongs to the row whose words sit closest to it, looking no further than its own
// section of the page; a photo with no row of its own, like a page's header photo, is the rest.
function closestByWords(image: HTMLElement, targets: Target[]): Target | undefined {
  for (let node = image.parentElement; node && !/^(MAIN|BODY)$/.test(node.tagName);) {
    const target = bestMatch(tidy(node.textContent ?? ''), targets);
    if (target) return target;
    if (/^(SECTION|HEADER|ARTICLE)$/.test(node.tagName)) break;
    node = node.parentElement;
  }
  return targets.find((one) => one.nearby.length === 0);
}

// Photos that take turns sit on top of each other; only the one showing can be picked.
function isShowing(element: Element): boolean {
  const view = element.ownerDocument.defaultView;
  for (let node: Element | null = element; node && view; node = node.parentElement) {
    const style = view.getComputedStyle(node);
    if (Number(style.opacity) < 0.5 || style.visibility === 'hidden') return false;
  }
  return true;
}

// A card's link stretches over the whole card, so a word counts only where it is drawn.
function covers(element: Element, x: number, y: number) {
  const box = element.getBoundingClientRect();
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}

// Overlays such as a caption over a photo sit above it, so look through them for something to edit.
export function editableAt(doc: Document, x: number, y: number): HTMLElement | null {
  for (const element of doc.elementsFromPoint(x, y)) {
    const found = element.closest<HTMLElement>(`[${EDIT}]`);
    if (found && isShowing(found) && covers(found, x, y)) return found;
  }
  return null;
}

export function setHover(doc: Document, element: HTMLElement | null) {
  doc.querySelectorAll(`[${HOVER}]`).forEach((other) => other.removeAttribute(HOVER));
  element?.setAttribute(HOVER, '');
}

export function showPicked(doc: Document, path: string | null) {
  doc.querySelectorAll(`[${PICKED}]`).forEach((element) => element.removeAttribute(PICKED));
  if (!path) return;
  doc
    .querySelectorAll(`[${EDIT}="${CSS.escape(path)}"]`)
    .forEach((element) => element.setAttribute(PICKED, ''));
}

export function showNewPhoto(doc: Document, path: string, url: string) {
  doc.querySelectorAll<HTMLImageElement>(`img[${EDIT}="${CSS.escape(path)}"]`).forEach((image) => {
    image.removeAttribute('srcset');
    image.src = url;
  });
}

export const PAGE_STYLE = `
  [${EDIT}] { cursor: pointer; }
  [${HOVER}] { outline: 2px dashed #6b3a8c; outline-offset: 3px; }
  [${PICKED}] { outline: 3px solid #3d1a55; outline-offset: 3px; }
  img[${HOVER}], img[${PICKED}] { outline-offset: -3px; }
`;
