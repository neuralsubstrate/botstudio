"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);
const block = (e: Event) => e.preventDefault();
const blockKeys = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null;
  if (
    SCROLL_KEYS.has(e.key) &&
    !t?.closest("input, textarea, select, button, a")
  ) {
    e.preventDefault();
  }
};

/** Pauses page scrolling (for a modal), and resumes it. Blocks scroll inputs
 *  rather than setting overflow on the page — overflow on the root breaks the
 *  sticky pin behind the modal and can jump the page. */
export const lockScroll = (locked: boolean) => {
  const method = locked ? "addEventListener" : "removeEventListener";
  window[method]("wheel", block, { passive: false } as AddEventListenerOptions);
  window[method]("touchmove", block, {
    passive: false,
  } as AddEventListenerOptions);
  window[method]("keydown", blockKeys as EventListener);
  window.dispatchEvent(
    new CustomEvent("botlane:scroll-lock", { detail: locked }),
  );
};

/** Optional smooth scroll — disabled when the user prefers reduced motion.
 *  Paused while a modal is open (lockScroll). */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onLock = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail) lenis.stop();
      else lenis.start();
    };
    window.addEventListener("botlane:scroll-lock", onLock);

    return () => {
      window.removeEventListener("botlane:scroll-lock", onLock);
      cancelAnimationFrame(frame);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return null;
}
