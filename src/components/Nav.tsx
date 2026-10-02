import Link from "next/link";
import { NAV, SITE } from "@/lib/content";
import styles from "./Nav.module.css";

export function Nav() {
  return (
    <header className={styles.nav}>
      <div className={`shell ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label={`${SITE.name} home`}>
          Botlane<span>Studios</span>
        </Link>
        <nav className={styles.menu} aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href + item.label} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <a className="btn btn-primary" href={`mailto:${SITE.email}`}>
            Let&apos;s chat
          </a>
        </div>
      </div>
    </header>
  );
}
