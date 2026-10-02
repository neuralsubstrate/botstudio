"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { CAPABILITIES, PROCESS, SITE } from "@/lib/content";
import styles from "./Nav.module.css";

/* ── Menu model (Studios routes only) ───────────────────────────────────── */

type Preview =
  | { kind: "capability"; index: string; eyebrow: string; bullets: readonly string[] }
  | { kind: "process" }
  | { kind: "craft" }
  | { kind: "studio" }
  | { kind: "about" }
  | { kind: "contact" };

type MenuItem = {
  href: string;
  label: string;
  hint: string;
  code?: string;
  preview: Preview;
};

type Menu = {
  id: string;
  label: string;
  width: number;
  items: MenuItem[];
  footer: { href: string; label: string }[];
};

const CRAFT_SURFACES = [
  "Atmospheric",
  "Systems",
  "Product web",
  "Editorial",
] as const;

const MENUS: Menu[] = [
  {
    id: "capabilities",
    label: "Capabilities",
    width: 720,
    items: CAPABILITIES.map((c) => ({
      href: `/capabilities#${c.slug}`,
      label: c.title,
      hint: c.bullets[0],
      code: c.index,
      preview: {
        kind: "capability",
        index: c.index,
        eyebrow: c.eyebrow,
        bullets: c.bullets,
      },
    })),
    footer: [
      { href: "/capabilities", label: "All capabilities" },
      { href: "/pricing", label: "Plan shapes" },
    ],
  },
  {
    id: "studio",
    label: "Studio",
    width: 660,
    items: [
      {
        href: "/",
        label: "Overview",
        hint: "Ultra-premium websites from Sheridan, WY",
        preview: { kind: "studio" },
      },
      {
        href: "/#craft",
        label: "Craft",
        hint: "Surfaces we care about — case studies when real",
        preview: { kind: "craft" },
      },
      {
        href: "/#process",
        label: "How we work",
        hint: "Four steps, no theater",
        preview: { kind: "process" },
      },
    ],
    footer: [{ href: `mailto:${SITE.email}`, label: "Start a conversation" }],
  },
  {
    id: "about",
    label: "About",
    width: 660,
    items: [
      {
        href: "/about",
        label: "About the studio",
        hint: "Honest craft, no fake portfolio",
        preview: { kind: "about" },
      },
      {
        href: "/#contact",
        label: "Contact",
        hint: `${SITE.email} · ${SITE.phone}`,
        preview: { kind: "contact" },
      },
    ],
    footer: [{ href: "/#contact", label: "Let's talk" }],
  },
];

/* ── Previews ───────────────────────────────────────────────────────────── */

function PreviewBody({ preview }: { preview: Preview }) {
  switch (preview.kind) {
    case "capability":
      return (
        <>
          <p className={`mono ${styles.pvEyebrow}`}>
            {preview.index} · {preview.eyebrow}
          </p>
          <ol className={styles.pvSteps}>
            {preview.bullets.map((b, i) => (
              <li
                key={b}
                className={styles.pvStep}
                style={{ "--i": i } as CSSProperties}
              >
                <span className={styles.pvNode} aria-hidden="true" />
                {b}
              </li>
            ))}
          </ol>
        </>
      );
    case "process":
      return (
        <>
          <p className={`mono ${styles.pvEyebrow}`}>Four steps to launch</p>
          <ol className={styles.pvRows}>
            {PROCESS.map((st, i) => (
              <li key={st.step} style={{ "--i": i } as CSSProperties}>
                <span className={`mono ${styles.pvNum}`}>{st.step}</span>
                <span>
                  <span className={styles.pvRowTitle}>{st.title}</span>
                  <span className={styles.pvRowBody}>{st.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </>
      );
    case "craft":
      return (
        <>
          <p className={`mono ${styles.pvEyebrow}`}>Surfaces we ship toward</p>
          <ol className={styles.pvRows}>
            {CRAFT_SURFACES.map((label, i) => (
              <li key={label} style={{ "--i": i } as CSSProperties}>
                <span className={styles.pvDash} aria-hidden="true" />
                <span>
                  <span className={styles.pvRowTitle}>{label}</span>
                  <span className={styles.pvRowBody}>Case studies when they are real</span>
                </span>
              </li>
            ))}
          </ol>
        </>
      );
    case "studio":
      return (
        <>
          <p className={`mono ${styles.pvEyebrow}`}>{SITE.legal}</p>
          <p className={styles.pvLede}>
            {SITE.name} builds ultra-premium marketing and product websites —
            calm systems, sharp craft, and production engineering in one loop.
          </p>
          <ol className={styles.pvRows}>
            {[
              { t: "Location", b: SITE.location },
              { t: "Focus", b: SITE.tagline },
              { t: "Contact", b: SITE.email },
            ].map((row, i) => (
              <li key={row.t} style={{ "--i": i } as CSSProperties}>
                <span className={styles.pvDash} aria-hidden="true" />
                <span>
                  <span className={styles.pvRowTitle}>{row.t}</span>
                  <span className={styles.pvRowBody}>{row.b}</span>
                </span>
              </li>
            ))}
          </ol>
        </>
      );
    case "about":
      return (
        <>
          <p className={`mono ${styles.pvEyebrow}`}>Studio practice</p>
          <p className={styles.pvLede}>
            The web practice of {SITE.legal}. We do not publish fake portfolios,
            invented metrics, or template team bios.
          </p>
          <ol className={styles.pvRows}>
            {[
              { t: "Honest process", b: "Capabilities and conversation over theater" },
              { t: "Real case studies", b: "They ship when the work is ready" },
              { t: "One loop", b: "Design and engineering without a handoff cliff" },
            ].map((row, i) => (
              <li key={row.t} style={{ "--i": i } as CSSProperties}>
                <span className={styles.pvDash} aria-hidden="true" />
                <span>
                  <span className={styles.pvRowTitle}>{row.t}</span>
                  <span className={styles.pvRowBody}>{row.b}</span>
                </span>
              </li>
            ))}
          </ol>
        </>
      );
    case "contact":
      return (
        <>
          <p className={`mono ${styles.pvEyebrow}`}>Reach us</p>
          <ol className={styles.pvRows}>
            {[
              { t: "Email", b: SITE.email },
              { t: "Phone", b: SITE.phone },
              { t: "Base", b: SITE.location },
            ].map((row, i) => (
              <li key={row.t} style={{ "--i": i } as CSSProperties}>
                <span className={styles.pvDash} aria-hidden="true" />
                <span>
                  <span className={styles.pvRowTitle}>{row.t}</span>
                  <span className={styles.pvRowBody}>{row.b}</span>
                </span>
              </li>
            ))}
          </ol>
        </>
      );
  }
}

/* ── One dropdown panel ─────────────────────────────────────────────────── */

function MenuPanel({
  menu,
  active,
  onNavigate,
  panelId,
}: {
  menu: Menu;
  active: boolean;
  onNavigate: () => void;
  panelId: string;
}) {
  const [hovered, setHovered] = useState(0);
  const item = menu.items[hovered] ?? menu.items[0];

  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setHovered(0);
  }

  return (
    <div className={styles.megaMenu} style={{ width: menu.width }}>
      <div className={styles.megaBody}>
        <ul className={styles.megaList} role="list">
          {menu.items.map((it, i) => (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`${styles.megaItem}${i === hovered ? ` ${styles.megaItemOn}` : ""}`}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onClick={onNavigate}
                tabIndex={active ? 0 : -1}
                aria-describedby={
                  i === hovered ? `${panelId}-preview` : undefined
                }
              >
                <span className={styles.megaItemTop}>
                  <span className={styles.megaItemLabel}>{it.label}</span>
                  {it.code ? (
                    <span className={`mono ${styles.megaItemCode}`}>
                      {it.code}
                    </span>
                  ) : null}
                </span>
                <span className={styles.megaItemHint}>{it.hint}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.pv} id={`${panelId}-preview`}>
          <div
            className={styles.pvSwap}
            key={`${menu.id}-${hovered}-${active}`}
          >
            <PreviewBody preview={item.preview} />
            <Link
              href={item.href}
              className={styles.pvMore}
              onClick={onNavigate}
              tabIndex={active ? 0 : -1}
            >
              Open {item.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.megaFoot}>
        {menu.footer.map((f) => (
          <Link
            key={f.href + f.label}
            href={f.href}
            className={styles.megaFootLink}
            onClick={onNavigate}
            tabIndex={active ? 0 : -1}
          >
            {f.label}
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Desktop menu bar ───────────────────────────────────────────────────── */

const OPEN_DELAY = 70;
const CLOSE_DELAY = 180;

export function NavMenu() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const [dir, setDir] = useState(0);
  const [hoverBox, setHoverBox] = useState<{ x: number; w: number } | null>(
    null,
  );
  const [panelBox, setPanelBox] = useState<{
    x: number;
    w: number;
    h: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRefs = useRef<Record<string, HTMLElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const show = useCallback((id: string) => {
    clearTimers();
    setOpenId((cur) => {
      if (cur && cur !== id) {
        const from = MENUS.findIndex((m) => m.id === cur);
        const to = MENUS.findIndex((m) => m.id === id);
        setDir(to > from ? 1 : -1);
      } else if (!cur) {
        setDir(0);
      }
      return id;
    });
  }, []);

  const hoverOpen = (id: string) => {
    clearTimers();
    if (openId) show(id);
    else openTimer.current = setTimeout(() => show(id), OPEN_DELAY);
  };

  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpenId(null);
      setHoverBox(null);
    }, CLOSE_DELAY);
  };

  const closeNow = useCallback(() => {
    clearTimers();
    setOpenId(null);
    setHoverBox(null);
  }, []);

  const trackHover = (el: HTMLElement | null) => {
    const list = listRef.current;
    if (!el || !list) return;
    const a = el.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setHoverBox({ x: a.left - b.left, w: a.width });
  };

  useLayoutEffect(() => {
    if (!openId) return;
    const menu = MENUS.find((m) => m.id === openId);
    const trigger = triggerRefs.current[openId];
    const root = rootRef.current;
    const panel = panelRefs.current[openId];
    if (!menu || !trigger || !root || !panel) return;
    const t = trigger.getBoundingClientRect();
    const r = root.getBoundingClientRect();
    const w = menu.width;
    const centre = t.left + t.width / 2;
    const minLeft = 16;
    const maxLeft = window.innerWidth - 16 - w;
    const left = Math.max(minLeft, Math.min(centre - w / 2, maxLeft));
    setPanelBox({ x: left - r.left, w, h: panel.offsetHeight });
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const panel = panelRefs.current[openId];
    if (!panel || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      setPanelBox((box) => (box ? { ...box, h: panel.offsetHeight } : box));
    });
    ro.observe(panel);
    return () => ro.disconnect();
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const t = triggerRefs.current[openId];
        closeNow();
        t?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeNow();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [openId, closeNow]);

  useEffect(() => () => clearTimers(), []);

  const onTriggerKey = (
    e: ReactKeyboardEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      show(id);
      requestAnimationFrame(() => {
        panelRefs.current[id]
          ?.querySelector<HTMLAnchorElement>("a")
          ?.focus();
      });
    }
  };

  const isOpen = openId !== null;

  return (
    <div
      ref={rootRef}
      className={styles.menuRoot}
      onMouseLeave={scheduleClose}
      onMouseEnter={() =>
        closeTimer.current && clearTimeout(closeTimer.current)
      }
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) closeNow();
      }}
    >
      <span
        className={styles.hoverPill}
        aria-hidden="true"
        data-on={hoverBox ? "true" : "false"}
        style={
          hoverBox
            ? ({
                "--x": `${hoverBox.x}px`,
                "--w": `${hoverBox.w}px`,
              } as CSSProperties)
            : undefined
        }
      />
      <ul ref={listRef} className={styles.menu} role="list">
        {MENUS.map((m) => (
          <li key={m.id}>
            <button
              ref={(el) => {
                triggerRefs.current[m.id] = el;
              }}
              type="button"
              className={styles.link}
              aria-expanded={openId === m.id}
              aria-controls={`${baseId}-${m.id}`}
              onMouseEnter={(e) => {
                trackHover(e.currentTarget);
                hoverOpen(m.id);
              }}
              onFocus={(e) => trackHover(e.currentTarget)}
              onClick={() => (openId === m.id ? closeNow() : show(m.id))}
              onKeyDown={(e) => onTriggerKey(e, m.id)}
            >
              {m.label}
              <svg
                className={styles.chev}
                width="11"
                height="11"
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
          </li>
        ))}
        <li>
          <Link
            href="/pricing"
            className={styles.link}
            onMouseEnter={(e) => {
              trackHover(e.currentTarget);
              scheduleClose();
            }}
            onFocus={(e) => trackHover(e.currentTarget)}
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            href="/#contact"
            className={styles.link}
            onMouseEnter={(e) => {
              trackHover(e.currentTarget);
              scheduleClose();
            }}
            onFocus={(e) => trackHover(e.currentTarget)}
          >
            Contact
          </Link>
        </li>
      </ul>

      <div
        className={styles.viewport}
        data-open={isOpen ? "true" : "false"}
        data-moving={isOpen && dir !== 0 ? "true" : "false"}
        style={
          panelBox
            ? ({
                "--px": `${panelBox.x}px`,
                "--pw": `${panelBox.w}px`,
                "--ph": `${panelBox.h}px`,
              } as CSSProperties)
            : undefined
        }
      >
        {MENUS.map((m) => {
          const active = openId === m.id;
          const idx = MENUS.findIndex((x) => x.id === m.id);
          const openIdx = MENUS.findIndex((x) => x.id === openId);
          const side = active ? 0 : idx < openIdx ? -1 : 1;
          return (
            <div
              key={m.id}
              id={`${baseId}-${m.id}`}
              ref={(el) => {
                panelRefs.current[m.id] = el;
              }}
              className={styles.panel}
              data-active={active ? "true" : "false"}
              style={{ "--side": side, "--dir": dir } as CSSProperties}
              aria-hidden={!active}
              {...(!active ? ({ inert: "" } as Record<string, string>) : {})}
            >
              <MenuPanel
                menu={m}
                active={active}
                onNavigate={closeNow}
                panelId={`${baseId}-${m.id}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { MENUS as NAV_MENUS };
