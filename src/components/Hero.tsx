import { SITE } from "@/lib/content";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`shell ${styles.inner}`}>
        <div className={styles.meta}>
          <span className="kicker">{"// 00.01°"}</span>
          <span className="kicker">{SITE.location}</span>
        </div>
        <p className={styles.eyebrow}>Ultra-premium websites</p>
        <h1 id="hero-title" className={styles.title}>
          Botlane
          <br />
          <span>Studios</span>
        </h1>
        <p className={styles.lede}>
          We design and build sites that feel inevitable — calm systems, sharp
          craft, and engineering that holds up after launch.
        </p>
        <div className={styles.ctas}>
          <a className="btn btn-primary" href="#craft">
            See work
          </a>
          <a className="btn btn-ghost" href="#contact">
            Let&apos;s chat
          </a>
        </div>
        <div className={styles.coords} aria-hidden="true">
          <span className="mono">{"// 00.02°"}</span>
          <span className="mono">N 44.8° · W 106.9°</span>
        </div>
      </div>
    </section>
  );
}
