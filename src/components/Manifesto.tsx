import styles from "./Manifesto.module.css";

const LINES = [
  { text: "we listen", accent: false },
  { text: "we imagine", accent: false },
  { text: "we create", accent: true },
  { text: "beautiful things", accent: false },
] as const;

export function Manifesto() {
  return (
    <section className={styles.strip} aria-label="Manifesto">
      <div className={`shell ${styles.inner}`}>
        {LINES.map((line) => (
          <p
            key={line.text}
            className={line.accent ? styles.accent : undefined}
          >
            {line.text}
          </p>
        ))}
      </div>
    </section>
  );
}
