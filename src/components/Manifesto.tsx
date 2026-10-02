"use client";

import { useEffect, useRef } from "react";
import styles from "./Manifesto.module.css";

const LINES = [
  { text: "we listen", accent: false },
  { text: "we imagine", accent: false },
  { text: "we create", accent: true },
  { text: "beautiful things", accent: false },
] as const;

/** Scroll-pinned manifesto film: one line blooms while the rest mist away.
 *  Sticky + native scroll progress (Lenis-compatible). Reduced motion gets a
 *  static stack with no pin — handled in CSS and by skipping the RAF loop. */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const glow = glowRef.current;
    if (!section || !stage || !glow) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      const lines = stage.querySelectorAll<HTMLElement>("[data-line]");
      lines.forEach((el) => {
        el.style.setProperty(
          "--bloom",
          el.dataset.accent === "true" ? "1" : "0.42",
        );
      });
      glow.style.opacity = "0.35";
      glow.style.transform = "translateY(0)";
      return;
    }

    const lines = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-line]"),
    );
    const n = lines.length;
    let raf = 0;
    let visible = true;
    let lastActive = -1;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(section);

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smoothstep = (x: number) => {
      const t = clamp01(x);
      return t * t * (3 - 2 * t);
    };

    const update = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const t = p * (n - 1);

      let best = 0;
      let bestBloom = 0;

      lines.forEach((el, i) => {
        const dist = Math.abs(t - i);
        const bloom = smoothstep(1 - Math.min(1, dist / 0.9));
        el.style.setProperty("--bloom", bloom.toFixed(4));
        if (bloom > bestBloom) {
          bestBloom = bloom;
          best = i;
        }
      });

      const activeEl = lines[best];
      if (activeEl) {
        const stageBox = stage.getBoundingClientRect();
        const lineBox = activeEl.getBoundingClientRect();
        const y =
          lineBox.top + lineBox.height / 2 - stageBox.top - stageBox.height / 2;
        glow.style.transform = `translateY(${y}px)`;
        glow.style.opacity = String(0.25 + bestBloom * 0.55);
        if (activeEl.dataset.accent === "true") glow.setAttribute("data-accent", "");
        else glow.removeAttribute("data-accent");
      }

      if (best !== lastActive) {
        lastActive = best;
        lines.forEach((el, i) => {
          if (i === best) el.setAttribute("data-active", "");
          else el.removeAttribute("data-active");
        });
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (visible) update();
    };

    update();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", update, { passive: true });

    const onMq = () => {
      if (!mq.matches) return;
      cancelAnimationFrame(raf);
      lines.forEach((el) => {
        el.style.setProperty(
          "--bloom",
          el.dataset.accent === "true" ? "1" : "0.42",
        );
        el.removeAttribute("data-active");
      });
      glow.style.opacity = "0.35";
      glow.style.transform = "translateY(0)";
      glow.removeAttribute("data-accent");
    };
    mq.addEventListener("change", onMq);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className={styles.section}
      data-nav-theme="dark"
      aria-label="Manifesto"
    >
      <div className={styles.pin}>
        <div className={styles.labelRow} aria-hidden="true">
          <span className={styles.label}>{"// 00.03° Manifesto"}</span>
        </div>
        <div ref={stageRef} className={styles.stage}>
          <div ref={glowRef} className={styles.glow} aria-hidden="true" />
          {LINES.map((line, i) => (
            <p
              key={line.text}
              data-line
              data-accent={line.accent ? "true" : undefined}
              data-active={i === 0 ? "" : undefined}
              className={
                line.accent ? `${styles.line} ${styles.accent}` : styles.line
              }
              style={{
                // First paint: lead with line 0 until scroll takes over.
                ["--bloom" as string]: i === 0 ? "1" : "0.12",
              }}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
