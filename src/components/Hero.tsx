"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SheridanClock } from "./SheridanClock";
import styles from "./Hero.module.css";

/** Theme portraits — native 2560×1440, not upscaled. */
const PORTRAITS = {
  dark: "/hero/portrait-dark.webp",
  light: "/hero/portrait-light.webp",
} as const;

const TICKS = [
  { label: "// 00.01°", y: 90 },
  { label: "// 00.02°", y: 220 },
  { label: "// 00.03°", y: 350 },
  { label: "// 00.04°", y: 540 },
] as const;

const HEADLINE =
  "Digital experiences that connect, scale and perform".split(" ");

type HeroTheme = "dark" | "light";

/**
 * Honest hero aligned to botlane.tech / bot-studio:
 * full-bleed media (bleeds under nav only; stage/CTAs clear of --nav-h),
 * soft scrims on headline + lockup, side ticks, mono message lines,
 * Sheridan time, craft/chat CTAs, showreel plate on the right.
 * Theme swaps the portrait (black vs white). Particle dots and breathe stay.
 * Hero-only light/dark treatment (in-session; does not theme the rest of the site).
 */
export function Hero() {
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [heroTheme, setHeroTheme] = useState<HeroTheme>("dark");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.heroTheme = heroTheme;
    return () => {
      delete document.documentElement.dataset.heroTheme;
    };
  }, [heroTheme]);

  const heroClass = [
    styles.hero,
    paused || reduceMotion ? styles.paused : "",
  ]
    .filter(Boolean)
    .join(" ");

  const nextTheme: HeroTheme = heroTheme === "dark" ? "light" : "dark";

  return (
    <section
      className={heroClass}
      data-hero-theme={heroTheme}
      aria-label="Botlane Studios"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.media} aria-hidden="true">
        {(Object.keys(PORTRAITS) as HeroTheme[]).map((theme) => (
          <Image
            key={theme}
            src={PORTRAITS[theme]}
            alt=""
            fill
            priority={theme === "dark"}
            loading={theme === "dark" ? "eager" : "lazy"}
            sizes="100vw"
            className={[
              styles.image,
              theme === "dark" ? styles.imageDark : styles.imageLight,
              !reduceMotion ? styles.imageBreathe : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
        <div className={styles.vignette} />
        <div className={styles.dotGrid} />
      </div>

      <div className={styles.stage}>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={() => setHeroTheme(nextTheme)}
          aria-pressed={heroTheme === "light"}
          aria-label={
            nextTheme === "light"
              ? "Switch hero to light treatment"
              : "Switch hero to dark treatment"
          }
        >
          <span className={styles.themeIcon} aria-hidden="true">
            {nextTheme === "light" ? "☀" : "☾"}
          </span>
          <span className={styles.themeLabel}>{nextTheme}</span>
        </button>

        {TICKS.map((tick) => (
          <div
            key={tick.label}
            className={styles.tick}
            style={{ ["--y" as string]: tick.y }}
            aria-hidden="true"
          >
            <span className={styles.tickMark} />
            <span className={styles.tickLine} />
            <span className={styles.tickLabel}>{tick.label}</span>
          </div>
        ))}

        <h2 className={`${styles.headline} ${styles.scrim}`}>
          {HEADLINE.map((word, i) => (
            <span key={i} className={styles.word}>
              {word}
              {i < HEADLINE.length - 1 ? " " : <b>.</b>}
            </span>
          ))}
        </h2>

        <p className={styles.tagline}>Quietly crafting for brands worldwide</p>

        <h1 className={`${styles.lockup} ${styles.scrim}`}>
          <span className={styles.accent}>Botlane</span>
          <span>\Studios</span>
        </h1>

        <div className={`${styles.message} ${styles.scrim}`}>
          <p>Small studio, worldwide tech.</p>
          <p>We create stories people remember.</p>
        </div>

        <div className={styles.time}>
          Our time <SheridanClock className={styles.clock} />
          <br />
          Sheridan, WY
        </div>

        <div className={styles.ctas}>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="#craft">
            See our craft
            <span className={styles.btnArrow} aria-hidden="true">
              →
            </span>
          </a>
          <a className={`${styles.btn} ${styles.btnLight}`} href="#contact">
            Let&apos;s chat
            <span className={styles.btnArrow} aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <a
          className={styles.reel}
          href="https://botlane.io"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Meet botlane.io (opens in a new tab)"
        >
          <div className={styles.reelHead}>
            <span>Showreel</span>
            <hr />
            <span>\\2026</span>
          </div>
          <div className={styles.reelVideo}>
            <video
              src="/botlane-intro.mp4"
              poster="/botlane-intro-poster.jpg"
              autoPlay
              muted
              playsInline
              preload="auto"
            />
          </div>
          <div className={styles.reelCap}>Meet botlane.io ↗</div>
        </a>
      </div>
    </section>
  );
}
