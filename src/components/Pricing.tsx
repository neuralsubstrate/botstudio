import Link from "next/link";
import { PLANS, SITE } from "@/lib/content";
import styles from "./Pricing.module.css";

export function Pricing() {
  return (
    <section id="pricing" className={`section ${styles.pricing}`}>
      <div className="shell">
        <div className="section-header">
          <div>
            <p className="kicker">Pricing</p>
            <h2 className="section-title">Plans, tailored quotes</h2>
          </div>
          <p className="section-lead">
            Structure without invented sticker prices. Every engagement is
            scoped to your brief — talk to us for a quote.
          </p>
        </div>
        <div className={styles.plans}>
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={styles.plan}
              data-featured={"featured" in plan && plan.featured ? "" : undefined}
            >
              <span className={styles.watermark} aria-hidden="true">
                {plan.watermark}
              </span>
              <div className={styles.head}>
                <h3>{plan.name}</h3>
                <p className={styles.price}>Tailored quote</p>
              </div>
              <p className={styles.blurb}>{plan.blurb}</p>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className="btn btn-ghost" href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Quote: ${plan.name}`)}`}>
                Talk to us
              </a>
            </article>
          ))}
        </div>
        <p className={styles.more}>
          Prefer detail first?{" "}
          <Link href="/pricing">See the pricing page</Link>.
        </p>
      </div>
    </section>
  );
}
