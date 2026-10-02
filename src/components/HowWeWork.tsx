import { PROCESS } from "@/lib/content";
import styles from "./HowWeWork.module.css";

export function HowWeWork() {
  return (
    <section id="process" className={`section ${styles.process}`}>
      <div className="shell">
        <div className="section-header">
          <div>
            <p className="kicker">How we work</p>
            <h2 className="section-title">Four steps, no theater</h2>
          </div>
          <p className="section-lead">
            A straightforward path from first conversation to a site that keeps
            earning its keep.
          </p>
        </div>
        <ol className={styles.steps}>
          {PROCESS.map((step) => (
            <li key={step.step} className={styles.card}>
              <span className={styles.num}>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
