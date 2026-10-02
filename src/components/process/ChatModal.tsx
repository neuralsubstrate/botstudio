"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Arrow } from "../motion/Arrow";
import { lockScroll } from "../SmoothScroll";
import styles from "./ChatModal.module.css";

const CLOSE_MS = 320;

/** Opens a WhatsApp chat with the studio, with a first line ready to send. */
const WHATSAPP = `https://wa.me/13072185715?text=${encodeURIComponent("Hi Botlane Studios, I'd like to talk about a project.")}`;

/** The WhatsApp glyph (Simple Icons). */
const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

/** The "Let's chat" modal. It pops out of the button that opened it: it
 *  starts at that spot, tipped back and tiny, and swings up to face the
 *  visitor; closing plays it back into the button. The card leans a little
 *  toward the pointer. Escape, the close button or a click outside close it;
 *  focus stays inside while it is open and returns to the button after. */
export function ChatModal({
  origin,
  onClose,
}: {
  /** Centre of the button that opened it, in viewport pixels. */
  origin: { x: number; y: number };
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, CLOSE_MS);
  };

  useEffect(() => {
    lockScroll(true);
    const opener = document.activeElement as HTMLElement | null;
    // Focus the card itself, so no link wears a focus ring on open.
    cardRef.current?.focus({ preventScroll: true });
    return () => {
      lockScroll(false);
      opener?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !cardRef.current) return;
      // Keep Tab inside the card.
      const items = Array.from(cardRef.current.querySelectorAll<HTMLElement>("a, button"));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === cardRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Lean toward the pointer, a few degrees at most.
  const onMove = (e: React.PointerEvent) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${dx * 8}deg`);
    el.style.setProperty("--rx", `${-dy * 6}deg`);
  };
  const onLeave = () => {
    tiltRef.current?.style.setProperty("--ry", "0deg");
    tiltRef.current?.style.setProperty("--rx", "0deg");
  };

  const from = {
    "--ox": `${origin.x - window.innerWidth / 2}px`,
    "--oy": `${origin.y - window.innerHeight / 2}px`,
  } as CSSProperties;

  return (
    <div className={styles.root} data-closing={closing || undefined} onPointerDown={(e) => e.target === e.currentTarget && close()}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.pop} style={from}>
        <div ref={tiltRef} className={styles.tilt} onPointerMove={onMove} onPointerLeave={onLeave}>
          <div ref={cardRef} className={styles.card} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="chat-title">
            <div className={styles.head}>
              <div className={styles.headGlow} aria-hidden="true" />
              <span className={styles.tag}>{"// Let's chat"}</span>
              <h2 id="chat-title" className={styles.title}>
                Tell us what you&apos;re building<b>.</b>
              </h2>
              <p className={styles.lede}>Small studio, worldwide tech. Message, write or call, whichever suits you.</p>
            </div>

            <ul className={styles.rows}>
              <li>
                <a className={`${styles.row} arrowHost`} href="mailto:admin@botlane.io?subject=Project%20enquiry">
                  <span className={styles.rowTag}>Email</span>
                  <span className={styles.rowValue}>admin@botlane.io</span>
                  <Arrow className={styles.rowArrow} />
                </a>
              </li>
              <li>
                <a className={`${styles.row} arrowHost`} href="tel:+13072185715">
                  <span className={styles.rowTag}>Call</span>
                  <span className={styles.rowValue}>+1 307 218 5715</span>
                  <Arrow className={styles.rowArrow} />
                </a>
              </li>
            </ul>

            <div className={styles.foot}>
              <a className={`${styles.whatsapp} arrowHost`} href={WHATSAPP} target="_blank" rel="noopener">
                <svg className={styles.waIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d={WHATSAPP_PATH} fill="currentColor" />
                </svg>
                Let&apos;s chat on WhatsApp
                <Arrow className={styles.waArrow} />
              </a>
            </div>

            <button type="button" className={styles.close} onClick={close} aria-label="Close">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
