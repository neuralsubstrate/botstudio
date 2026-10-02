import styles from "./Craft.module.css";

const TILES = [
  { label: "Atmospheric", tone: "a" },
  { label: "Systems", tone: "b" },
  { label: "Product web", tone: "c" },
  { label: "Editorial", tone: "d" },
] as const;

export function Craft() {
  return (
    <section id="craft" className={`section ${styles.craft}`}>
      <div className="shell">
        <div className="section-header">
          <div>
            <p className="kicker">Craft</p>
            <h2 className="section-title">Selected work — coming</h2>
          </div>
          <p className="section-lead">
            Case studies ship when they are real. Until then, these tiles mark
            the kinds of surfaces we care about — not placeholder clients.
          </p>
        </div>
        <div className={styles.grid}>
          {TILES.map((tile) => (
            <article
              key={tile.label}
              className={styles.tile}
              data-tone={tile.tone}
            >
              <span className="mono">{tile.label}</span>
              <span className={styles.soon}>Soon</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
