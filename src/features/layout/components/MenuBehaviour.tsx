'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const OPEN_DELAY = 90;
const CLOSE_DELAY = 240;

// The header menus are plain <details>, so they work before this loads and without JavaScript.
// With a mouse, a menu opens on hover and stays open while the pointer is over it or its panel;
// clicking its button keeps it open until the visitor clicks elsewhere. Escape or a click
// anywhere else closes it, and Escape returns focus to the button. Choosing a link in a menu
// closes it, so the new page is not left hidden under a long list on a phone.
export function MenuBehaviour({ navId }: { navId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    document
      .getElementById(navId)
      ?.querySelectorAll<HTMLDetailsElement>('details[open]')
      .forEach((menu) => (menu.open = false));
  }, [navId, pathname]);

  useEffect(() => {
    const nav = document.getElementById(navId);
    if (!nav) return;
    const menus = [...nav.querySelectorAll<HTMLDetailsElement>('details')];
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const pinned = new WeakSet<HTMLDetailsElement>();
    const timers = new WeakMap<HTMLDetailsElement, number>();

    const later = (menu: HTMLDetailsElement, run: () => void, delay: number) => {
      window.clearTimeout(timers.get(menu));
      timers.set(menu, window.setTimeout(run, delay));
    };
    const close = (menu: HTMLDetailsElement) => {
      window.clearTimeout(timers.get(menu));
      pinned.delete(menu);
      menu.open = false;
    };
    const closeOthers = (keep: HTMLDetailsElement) =>
      menus.filter((menu) => menu !== keep).forEach(close);

    const cleanups = menus.map((menu) => {
      const summary = menu.querySelector('summary');
      const enter = () => {
        if (!hover.matches) return;
        later(
          menu,
          () => {
            closeOthers(menu);
            menu.open = true;
          },
          menu.open ? 0 : OPEN_DELAY,
        );
      };
      const leave = () => {
        if (!hover.matches || pinned.has(menu)) return;
        later(menu, () => (menu.open = false), CLOSE_DELAY);
      };
      const click = (event: MouseEvent) => {
        // A menu opened by hovering stays open when its button is clicked, rather than closing.
        if (menu.open && !pinned.has(menu) && hover.matches && event.detail > 0) {
          event.preventDefault();
          pinned.add(menu);
          return;
        }
        if (menu.open) pinned.delete(menu);
        else {
          closeOthers(menu);
          pinned.add(menu);
        }
      };
      const choose = (event: MouseEvent) => {
        if ((event.target as Element).closest('a')) close(menu);
      };
      menu.addEventListener('pointerenter', enter);
      menu.addEventListener('pointerleave', leave);
      menu.addEventListener('click', choose);
      summary?.addEventListener('click', click);
      return () => {
        menu.removeEventListener('pointerenter', enter);
        menu.removeEventListener('pointerleave', leave);
        menu.removeEventListener('click', choose);
        summary?.removeEventListener('click', click);
      };
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      menus
        .filter((menu) => menu.open)
        .forEach((menu) => {
          close(menu);
          menu.querySelector('summary')?.focus();
        });
    };
    const onPointer = (event: PointerEvent) => {
      menus.filter((menu) => menu.open && !menu.contains(event.target as Node)).forEach(close);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [navId]);

  return null;
}
