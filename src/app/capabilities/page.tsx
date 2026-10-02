import type { Metadata } from "next";
import { CAPABILITIES } from "@/lib/content";
import styles from "@/components/Services.module.css";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Brand Identity, Strategy, Design & Innovation, AI Systems, SEO, and Development.",
};

export default function CapabilitiesPage() {
  return (
    <>
      <div className="shell page-hero">
        <p className="kicker">Capabilities</p>
        <h1>Six disciplines, one studio</h1>
        <p>
          Identity through launch engineering — concise scopes, honest craft,
          no agency bloat.
        </p>
      </div>
      <section className={`section ${styles.services}`} style={{ paddingTop: 0 }}>
        <div className="shell">
          <ol className={styles.list}>
            {CAPABILITIES.map((cap) => (
              <li key={cap.index} className={styles.item}>
                <div className={styles.meta}>
                  <span className="kicker">{cap.eyebrow}</span>
                  <span className={styles.index}>/{cap.index}</span>
                </div>
                <h2 className={styles.title}>{cap.title}</h2>
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
    </>
  );
}
