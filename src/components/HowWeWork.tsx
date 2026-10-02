"use client";

import { useEffect, useRef } from "react";
import { PROCESS } from "@/lib/content";
import styles from "./HowWeWork.module.css";

/** Sticky vertical step film: exactly one step fills the viewport.
 *  No horizontal strip — impossible to render as four side-by-side cards. */
export function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const fill = fillRef.current;
    const indexEl = indexRef.current;
    const titleEl = titleRef.current;
    if (!section || !fill || !indexEl || !titleEl) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const panels = Array.from(
      section.querySelectorAll<HTMLElement>("[data-step]"),
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
      fill.style.transform = `scaleX(${p})`;

      const active = Math.min(n - 1, Math.round(p * (n - 1)));
      if (active === lastActive) return;
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
        <header className={styles.chrome}>
          <div className={styles.labelRow}>
            <span className={styles.label}>{"// 00.06° How we work"}</span>
            <span ref={indexRef} className={styles.liveIndex} aria-hidden="true">
              01 / 04
            </span>
          </div>
          <h2 id="how-we-work-title" className={styles.title}>
            Four steps, no theater
          </h2>
          <p className={styles.lead}>
            Scroll to advance — one full step at a time.
          </p>
        </header>

        <div className={styles.stage}>
          {PROCESS.map((step, i) => (
            <article
              key={step.step}
              data-step
              data-active={i === 0 ? "" : undefined}
              className={styles.slide}
            >
              <span className={styles.watermark} aria-hidden="true">
                {step.step}
              </span>
              <div className={styles.slideBody}>
                <span className={styles.stepNum}>{step.step}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </article>
          ))}
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
