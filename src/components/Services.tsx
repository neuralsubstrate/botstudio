import { CAPABILITIES } from "@/lib/content";
import styles from "./Services.module.css";

export function Services() {
  return (
    <section id="capabilities" className={`section ${styles.services}`}>
      <div className="shell">
        <div className="section-header">
          <div>
            <p className="kicker">Capabilities</p>
            <h2 className="section-title">What we cover</h2>
          </div>
          <p className="section-lead">
            Six disciplines, one studio — identity through launch engineering,
            without the agency bloat.
          </p>
        </div>
        <ol className={styles.list}>
          {CAPABILITIES.map((cap) => (
            <li key={cap.index} id={cap.slug} className={styles.item}>
              <div className={styles.meta}>
                <span className="kicker">{cap.eyebrow}</span>
                <span className={styles.index}>/{cap.index}</span>
              </div>
              <h3 className={styles.title}>{cap.title}</h3>
              <ul className={styles.bullets}>
                {cap.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
