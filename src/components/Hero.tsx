"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/content";
import styles from "./Hero.module.css";

const SLIDES = [
  "/hero/background.webp",
  "/hero/background-02.webp",
] as const;

/** Calm crossfade interval between hero backgrounds (ms). */
const ROTATION_MS = 6000;

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused]);

  const heroClass = [
    styles.hero,
    paused || reduceMotion ? styles.paused : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={heroClass}
      aria-labelledby="hero-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.media} aria-hidden="true">
        {SLIDES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            sizes="100vw"
            className={[
              styles.image,
              i === active ? styles.imageActive : "",
              !reduceMotion ? styles.imageBreathe : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
        <div className={styles.scrim} />
        {/* Fine particle/dot grid — matches Framer Create® hero Dots layer */}
        <div className={styles.dotGrid} aria-hidden="true" />
      </div>

      <div className={`shell ${styles.inner}`}>
        <aside className={styles.rail} aria-hidden="true">
          <span className="mono">{"// 00.01°"}</span>
          <span className="mono">{"// 00.02°"}</span>
          <span className="mono">{"// 00.03°"}</span>
          <span className="mono">{"// 00.04°"}</span>
        </aside>

        <div className={styles.copy}>
          <div className={`${styles.glass} ${styles.glassHeadline}`}>
            <p className={styles.eyebrow}>Ultra-premium websites</p>
            <h1 id="hero-title" className={styles.title}>
              that connect, scale
              <br />
              <span>and perform.</span>
            </h1>
          </div>

          <p className={`${styles.glass} ${styles.glassBrand}`} aria-label={SITE.name}>
            <span className={styles.brandAccent}>Botlane</span>
            <span className={styles.brandRest}>\Studios</span>
          </p>

          <div className={`${styles.glass} ${styles.glassBody}`}>
            <p className={styles.lede}>
              A design studio for brands that want sites people remember —
              calm systems, sharp craft, and engineering that holds after launch.
            </p>
            <p className={styles.metaLine}>
              <span className="mono">{SITE.location}</span>
              <span className="mono" aria-hidden="true">
                N 44.8° · W 106.9°
              </span>
            </p>
            <div className={styles.ctas}>
              <a className="btn btn-primary" href="#craft">
                See work
              </a>
              <a className={`btn ${styles.btnChat}`} href="#contact">
                Let&apos;s chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
