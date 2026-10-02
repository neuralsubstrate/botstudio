import Link from "next/link";
import { NAV, SITE } from "@/lib/content";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={`shell ${styles.cta}`}>
        <span className="kicker">{"// 00.05° Let's talk"}</span>
        <h2>
          Got something worth building<span>?</span>
        </h2>
        <p>
          Tell us where you&apos;re headed. We&apos;ll shape the site that gets
          you there.
        </p>
        <div className={styles.ctaRow}>
          <a className="btn btn-primary" href={`mailto:${SITE.email}`}>
            Email us
          </a>
          <a
            className="btn btn-ghost"
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className={`shell ${styles.grid}`}>
        <div>
          <p className={styles.brand}>
            {SITE.name}
            <br />
            {SITE.legal} · {SITE.location}
          </p>
          <p className={styles.note}>{SITE.domainsNote}</p>
        </div>
        <div>
          <p className="kicker">Navigate</p>
          <ul>
            {NAV.map((item) => (
              <li key={item.href + item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker">Contact</p>
          <ul>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
            </li>
            <li>{SITE.location}</li>
          </ul>
        </div>
      </div>

      <div className={`shell ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} {SITE.legal}. All rights reserved.</p>
        <p className="mono">Accent #0077E6 · Dark-first</p>
      </div>
    </footer>
  );
}
