"use client";

import { useEffect, useRef } from "react";
import { PROCESS } from "@/lib/content";
import styles from "./HowWeWork.module.css";

/** Sticky horizontal step film: vertical scroll scrubs Discovery → Launch
 *  across a pinned stage. One full-bleed frame at a time — never a 4-up
 *  card grid. Lenis-compatible via getBoundingClientRect progress.
 *  Reduced motion collapses to a stacked list. */
export function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;
    const fill = fillRef.current;
    const indexEl = indexRef.current;
    const titleEl = titleRef.current;
    if (!section || !strip || !fill || !indexEl || !titleEl) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const panels = Array.from(
      strip.querySelectorAll<HTMLElement>("[data-step]"),
    );
    const ticks = Array.from(
      section.querySelectorAll<HTMLElement>("[data-tick]"),
    );
    const n = panels.length;
    let raf = 0;
    let visible = true;
    let lastActive = -1;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "40% 0px" },
    );
    io.observe(section);

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const update = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;

      const maxX = Math.max(0, strip.scrollWidth - strip.clientWidth);
      const x = maxX * p;
      strip.style.transform = `translate3d(${-x}px, 0, 0)`;
      fill.style.transform = `scaleX(${p})`;

      const active = Math.min(n - 1, Math.round(p * (n - 1)));
      if (active !== lastActive) {
        lastActive = active;
        panels.forEach((el, i) => {
          if (i === active) el.setAttribute("data-active", "");
          else el.removeAttribute("data-active");
        });
        ticks.forEach((el, i) => {
          if (i === active) el.setAttribute("data-active", "");
          else el.removeAttribute("data-active");
        });
        indexEl.textContent = `${PROCESS[active]?.step ?? "01"} / 0${n}`;
        titleEl.textContent = PROCESS[active]?.title ?? "";
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
      strip.style.transform = "";
      fill.style.transform = "scaleX(0)";
      panels.forEach((el) => el.removeAttribute("data-active"));
      ticks.forEach((el) => el.removeAttribute("data-active"));
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
      id="process"
      className={styles.section}
      data-nav-theme="dark"
      data-film="how-we-work"
      aria-labelledby="how-we-work-title"
    >
      <div className={styles.pin}>
        <div className={styles.top}>
          <div className={styles.labelRow}>
            <span className={styles.label}>{"// 00.06° How we work"}</span>
            <span className={styles.filmCue} aria-hidden="true">
              Sticky film · scroll to scrub
            </span>
            <span ref={indexRef} className={styles.liveIndex} aria-hidden="true">
              01 / 04
            </span>
          </div>
          <div className={styles.intro}>
            <h2 id="how-we-work-title" className={styles.title}>
              Four steps, no theater
            </h2>
            <p className={styles.lead}>
              A straightforward path from first conversation to a site that keeps
              earning its keep — one frame at a time.
            </p>
          </div>
        </div>

        <div className={styles.viewport}>
          <div ref={stripRef} className={styles.strip}>
            {PROCESS.map((step, i) => (
              <article
                key={step.step}
                data-step
                data-active={i === 0 ? "" : undefined}
                className={styles.frame}
                style={{ ["--i" as string]: String(i) }}
              >
                <span className={styles.watermark} aria-hidden="true">
                  {step.step}
                </span>
                <div className={styles.frameBody}>
                  <span className={styles.stepNum}>{step.step}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
                <div className={styles.rail} aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <div className={styles.track}>
            <div ref={fillRef} className={styles.fill} />
          </div>
          <div className={styles.scrubMeta}>
            <ol className={styles.ticks}>
              {PROCESS.map((step, i) => (
                <li
                  key={step.step}
                  data-tick
                  data-active={i === 0 ? "" : undefined}
                />
              ))}
            </ol>
            <span ref={titleRef} className={styles.scrubTitle}>
              Discovery
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
