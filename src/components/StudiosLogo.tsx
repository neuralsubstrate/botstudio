"use client";

import { useId } from "react";

/**
 * Studios mark — blue plate with milled channel + lamp (matches public/studios-mark.svg).
 * Size is the mark's square edge in px; keep ~20 so it fits the existing --nav-h.
 */
export function StudiosMark({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-hidden="true"
      className={className}
      style={{ display: "block", flex: "none" }}
    >
      <defs>
        <linearGradient
          id={`p${uid}`}
          x1="32"
          y1="1"
          x2="32"
          y2="63"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0077E6" />
          <stop offset="0.55" stopColor="#0077E6" />
          <stop offset="1" stopColor="#0066C7" />
        </linearGradient>
        <linearGradient id={`s${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#08090A" />
          <stop offset="0.62" stopColor="#15181C" />
          <stop offset="1" stopColor="#2A2F36" />
        </linearGradient>
        <radialGradient id={`l${uid}`} cx="0.34" cy="0.3" r="0.72">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#F6F5F1" />
          <stop offset="1" stopColor="#D9D8D2" />
        </radialGradient>
        <filter
          id={`g${uid}`}
          x="-160%"
          y="-160%"
          width="420%"
          height="420%"
        >
          <feGaussianBlur stdDeviation="3.1" />
        </filter>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="17" fill={`url(#p${uid})`} />
      <rect
        x="1.75"
        y="1.75"
        width="60.5"
        height="60.5"
        rx="16.3"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="17"
        fill="none"
        stroke="#0077E6"
        strokeOpacity="0.6"
        strokeWidth="1"
      />
      <rect x="12" y="25" width="40" height="14" rx="7" fill={`url(#s${uid})`} />
      <path
        d="M19 38.4h26"
        stroke="#FFFFFF"
        strokeOpacity="0.16"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle
        cx="21"
        cy="32"
        r="5.4"
        fill="#FFFFFF"
        opacity="0.55"
        filter={`url(#g${uid})`}
      />
      <circle cx="21" cy="32" r="5" fill={`url(#l${uid})`} />
    </svg>
  );
}
