"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Craft.module.css";

const SURFACES = [
  {
    id: "atmospheric",
    index: "01",
    label: "Atmospheric",
    line: "Quiet frames, heavy presence — sites that feel like rooms, not templates.",
  },
  {
    id: "systems",
    index: "02",
    label: "Systems",
    line: "Tokens, type, and components that scale without going soft.",
  },
  {
    id: "product",
    index: "03",
    label: "Product web",
    line: "Marketing and product in one language — clear paths, sharp UI.",
  },
  {
    id: "editorial",
    index: "04",
    label: "Editorial",
    line: "Long-form and brand narrative with rhythm, not filler.",
  },
] as const;

/** Selected work — honest placeholders. One surface at a time (tabs),
 *  never a fragile 4-up card grid that misreads as portfolio work. */
export function Craft() {
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    el.setAttribute("data-enter", "");
    const t = window.setTimeout(() => el.removeAttribute("data-enter"), 420);
    return () => window.clearTimeout(t);
  }, [active]);

  const current = SURFACES[active]!;

  return (
    <section id="craft" className={styles.section} data-nav-theme="light">
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.kicker}>{"// Craft"}</p>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Selected work — coming</h2>
            <p className={styles.lead}>
              Case studies ship when they are real. Until then, this is the
              kinds of surfaces we build for — not fake clients.
            </p>
          </div>
        </header>

        <div className={styles.board}>
          <nav className={styles.rail} aria-label="Craft surfaces">
            {SURFACES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={styles.railBtn}
                data-active={i === active ? "" : undefined}
                aria-current={i === active ? "true" : undefined}
                onClick={() => setActive(i)}
              >
                <span className={styles.railIndex}>{s.index}</span>
                <span className={styles.railLabel}>{s.label}</span>
              </button>
            ))}
          </nav>

          <div
            ref={panelRef}
            className={styles.panel}
            data-tone={current.id}
            role="region"
            aria-live="polite"
            aria-label={current.label}
          >
            <div className={styles.panelChrome}>
              <span className={styles.panelIndex}>{current.index}</span>
              <span className={styles.badge}>Coming</span>
            </div>
            <h3 className={styles.panelTitle}>{current.label}</h3>
            <p className={styles.panelLine}>{current.line}</p>
            <p className={styles.panelFoot}>
              Real projects will replace this panel. No placeholder brands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
