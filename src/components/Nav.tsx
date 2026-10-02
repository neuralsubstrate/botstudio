"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CAPABILITIES, SITE } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavMenu } from "./NavMenu";
import { StudiosMark } from "./StudiosLogo";
import styles from "./Nav.module.css";

const BREAKPOINT = 900;

const DRAWER_LINKS = [
  { href: "/", label: "Studio" },
  { href: "/#craft", label: "Craft" },
  { href: "/#process", label: "How we work" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerCapsOpen, setDrawerCapsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerId = useId();
  const drawerCapsMenuId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setDrawerCapsOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setDrawerCapsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINT + 1}px)`);
    const onChange = () => {
      if (mq.matches) {
        setOpen(false);
        setDrawerCapsOpen(false);
        document.body.style.overflow = "";
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header
        className={styles.nav}
        data-scrolled={scrolled && !open ? "true" : "false"}
        data-open={open ? "true" : "false"}
      >
        <div className={`shell ${styles.inner}`}>
          <Link
            href="/"
            className={styles.logo}
            aria-label={`${SITE.name} home`}
            onClick={close}
          >
            <StudiosMark size={20} />
            <span className={styles.logoText}>
              Botlane<span>Studios</span>
            </span>
          </Link>

          <nav className={styles.desktop} aria-label="Primary">
            <NavMenu />
          </nav>

          <div className={styles.actions}>
            <ThemeToggle />
            <a
              className={`btn btn-primary ${styles.cta}`}
              href={`mailto:${SITE.email}`}
            >
              Let&apos;s chat
            </a>
            <button
              ref={toggleRef}
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls={drawerId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <svg
                className={styles.iconOpen}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 4.5h12M2 11.5h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                className={styles.iconClose}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className={styles.scrim}
        data-open={open ? "true" : "false"}
        onClick={close}
        aria-hidden="true"
      />

      {/* Stack sits outside <header> so backdrop-filter cannot clip it. */}
      <div
        className={styles.drawerStack}
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
      >
        <div
          className={`${styles.drawerLayer} ${styles.drawerLayer2}`}
          aria-hidden="true"
        />
        <div
          className={`${styles.drawerLayer} ${styles.drawerLayer1}`}
          aria-hidden="true"
        />
        <div
          id={drawerId}
          className={styles.drawer}
          data-open={open ? "true" : "false"}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className={styles.drawerInner}>
            <div className={styles.drawerGroup}>
              <button
                type="button"
                className={`${styles.drawerAccordion} ${styles.drawerParent}`}
                aria-expanded={drawerCapsOpen}
                aria-controls={drawerCapsMenuId}
                onClick={() => setDrawerCapsOpen((v) => !v)}
              >
                Capabilities
                <svg
                  className={styles.drawerChevron}
                  width="12"
                  height="12"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 3.75 5 6.25 7.5 3.75"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div
                id={drawerCapsMenuId}
                className={styles.drawerNested}
                data-open={drawerCapsOpen ? "true" : "false"}
                hidden={!drawerCapsOpen}
              >
                {CAPABILITIES.map((cap) => (
                  <Link
                    key={cap.slug}
                    href={`/capabilities#${cap.slug}`}
                    onClick={close}
                  >
                    <span>{cap.title}</span>
                    <span className={`mono ${styles.drawerCode}`}>
                      {cap.index}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/capabilities"
                  className={styles.drawerAll}
                  onClick={close}
                >
                  View all capabilities
                </Link>
              </div>
            </div>

            {DRAWER_LINKS.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={close}
              >
                {item.label}
              </Link>
            ))}

            <div className={styles.drawerAuth}>
              <a
                className={`${styles.drawerCta} ${styles.drawerCtaPrimary}`}
                href={`mailto:${SITE.email}`}
                onClick={close}
              >
                Let&apos;s chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
