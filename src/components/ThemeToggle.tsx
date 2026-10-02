"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

const COOKIE = "botstudio-theme";
const MAX_AGE = 60 * 60 * 24 * 365;

function readCookie(): "light" | "dark" | null {
  const m = document.cookie.match(/(?:^|; )botstudio-theme=(light|dark)/);
  return m ? (m[1] as "light" | "dark") : null;
}

function writeCookie(theme: "light" | "dark") {
  document.cookie = `${COOKIE}=${theme}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const stored = readCookie();
    const next = stored === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    writeCookie(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={toggle}
      aria-pressed={theme === "light"}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === "dark" ? "☀" : "☾"}
      </span>
      <span className={styles.label}>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
