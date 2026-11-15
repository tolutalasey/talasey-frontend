'use client';

import { useEffect, useRef, useState } from 'react';
import { stagePreview } from '../actions';
import styles from './LivePreview.module.css';
import {
  EDIT,
  editableAt,
  markPage,
  PAGE_STYLE,
  setHover,
  showNewPhoto,
  showPicked,
  targetsIn,
} from './page-picker';
import { usePick } from './PickContext';

type View = 'draft' | 'live';
type Device = 'desktop' | 'phone';
type State = 'updating' | 'ready' | 'failed';

const WIDTH: Record<Device, number> = { desktop: 1280, phone: 390 };
const PAUSE = 700;

const STATE_TEXT: Record<State, string> = {
  updating: 'Updating…',
  ready: 'Up to date',
  failed: 'Could not update. Keep typing to try again.',
};

interface Props {
  documentId: string;
  livePath: string | null;
}

// The real page beside the form. A moment after typing stops, what is in the form is sent for
// the preview only, and the page redraws in the same spot.
export function LivePreview({ documentId, livePath }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>('draft');
  const [device, setDevice] = useState<Device>('desktop');
  const [state, setState] = useState<State>('updating');
  const [version, setVersion] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [page, setPage] = useState<Document | null>(null);
  const newPhotos = useRef(new Map<string, string>());
  const pick = usePick();
  const pickedPath = pick?.picked?.path ?? null;

  useEffect(() => {
    const element = screen.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const form = panel.current?.closest('form');
    if (!form) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let latest = 0;

    const stage = async () => {
      const attempt = ++latest;
      setState('updating');
      const data = new FormData(form);
      for (const [name, value] of [...data.entries()]) {
        if (value instanceof File) data.delete(name);
      }
      const ok = await stagePreview(data).catch(() => false);
      if (attempt !== latest) return;
      if (ok) setVersion((current) => current + 1);
      else setState('failed');
    };

    const later = () => {
      clearTimeout(timer);
      timer = setTimeout(stage, PAUSE);
    };

    void stage();
    form.addEventListener('input', later);
    form.addEventListener('change', later);
    return () => {
      clearTimeout(timer);
      form.removeEventListener('input', later);
      form.removeEventListener('change', later);
    };
  }, []);

  useEffect(() => {
    const form = panel.current?.closest('form');
    if (!form) return;
    const photos = newPhotos.current;
    const chosen = (event: Event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== 'file') return;
      const path = input.name.replace(/\.file$/, '');
      const file = input.files?.[0];
      const old = photos.get(path);
      if (old) URL.revokeObjectURL(old);
      if (file) photos.set(path, URL.createObjectURL(file));
      else photos.delete(path);
      const thumbnail = form.querySelector<HTMLImageElement>(
        `[data-field="${CSS.escape(path)}"] img`,
      );
      const shown = photos.get(path);
      if (thumbnail && shown) thumbnail.src = shown;
    };
    form.addEventListener('change', chosen, true);
    return () => {
      form.removeEventListener('change', chosen, true);
      photos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const form = panel.current?.closest('form');
    if (!page || !form || !pick) return;
    const style = page.createElement('style');
    style.textContent = PAGE_STYLE;
    page.head.append(style);
    markPage(page, targetsIn(form));
    newPhotos.current.forEach((url, path) => showNewPhoto(page, path, url));

    const labelOf = (path: string) => {
      const field = form.querySelector<HTMLElement>(`[data-field="${CSS.escape(path)}"]`);
      const label = field?.dataset.label ?? 'This part';
      const row = field?.closest<HTMLElement>('[data-row]');
      const list = row?.parentElement?.closest<HTMLElement>('[data-field]');
      if (!row || !list) return label;
      const number = [...list.querySelectorAll(':scope > fieldset > [data-row]')].indexOf(row) + 1;
      return `${list.dataset.label} ${number} · ${label}`;
    };
    const move = (event: MouseEvent) =>
      setHover(page, editableAt(page, event.clientX, event.clientY));
    const click = (event: MouseEvent) => {
      const found = editableAt(page, event.clientX, event.clientY);
      const target = event.target instanceof Element ? event.target : null;
      if (found) {
        event.preventDefault();
        event.stopPropagation();
        const path = found.getAttribute(EDIT) ?? '';
        pick.pick({ path, label: labelOf(path) });
        pick.setShowAll(false);
        return;
      }
      if (target?.closest('a, form')) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (!target?.closest('button')) pick.miss();
    };
    const submit = (event: Event) => event.preventDefault();
    page.addEventListener('mousemove', move);
    page.addEventListener('click', click, true);
    page.addEventListener('submit', submit, true);
    return () => {
      page.removeEventListener('mousemove', move);
      page.removeEventListener('click', click, true);
      page.removeEventListener('submit', submit, true);
      style.remove();
    };
    // The page is marked once per load; picking only changes what is outlined.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (page) showPicked(page, pickedPath);
  }, [page, pickedPath]);

  const showing = view === 'live' && livePath ? livePath : `/preview/${documentId}/?v=${version}`;
  const pageWidth = WIDTH[device];
  const scale = size.width > 0 ? Math.min(1, size.width / pageWidth) : 1;

  return (
    <div ref={panel} className={styles.panel}>
      <div className={styles.toolbar}>
        <div className={styles.segment} role="group" aria-label="Show">
          <button type="button" aria-pressed={view === 'draft'} onClick={() => setView('draft')}>
            Your draft
          </button>
          <button
            type="button"
            aria-pressed={view === 'live'}
            onClick={() => {
              setView('live');
              setPage(null);
            }}
            disabled={!livePath}
            title={livePath ? undefined : 'Not on the site yet'}
          >
            Live now
          </button>
        </div>
        <div className={styles.segment} role="group" aria-label="Screen size">
          <button
            type="button"
            aria-pressed={device === 'desktop'}
            onClick={() => setDevice('desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            aria-pressed={device === 'phone'}
            onClick={() => setDevice('phone')}
          >
            Phone
          </button>
        </div>
        <p
          className={styles.state}
          data-state={view === 'live' ? 'ready' : state}
          aria-live="polite"
        >
          {view === 'live' ? 'What shoppers see now' : STATE_TEXT[state]}
        </p>
        <a href={showing} target="_blank" rel="noreferrer" className={styles.open}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </svg>
          <span className={styles.hidden}>Open the preview in a new tab</span>
        </a>
      </div>

      <div ref={screen} className={styles.screen} data-device={device}>
        {version > 0 || view === 'live' ? (
          <iframe
            key={view}
            src={showing}
            title={view === 'live' ? 'The page as it is now' : 'Preview of your draft'}
            className={styles.frame}
            onLoad={(event) => {
              if (view !== 'draft') return;
              setState((current) => (current === 'failed' ? current : 'ready'));
              setPage(event.currentTarget.contentDocument);
            }}
            style={{
              width: pageWidth,
              height: size.height / scale,
              transform: `scale(${scale})`,
            }}
          />
        ) : (
          <div className={styles.loading}>Getting the preview ready…</div>
        )}
      </div>
    </div>
  );
}
