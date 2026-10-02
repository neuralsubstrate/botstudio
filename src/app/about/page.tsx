import type { Metadata } from "next";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name} — ultra-premium websites from ${SITE.location}.`,
};

export default function AboutPage() {
  return (
    <div className="shell page-hero">
      <p className="kicker">About</p>
      <h1>A studio for sites that feel inevitable</h1>
      <div className="prose-stub" style={{ marginTop: 32 }}>
        <p>
          {SITE.name} is the web practice of {SITE.legal}, based in{" "}
          {SITE.location}. We build ultra-premium marketing and product
          websites — calm systems, sharp craft, and production engineering in
          one loop.
        </p>
        <p>
          We do not publish fake portfolios, invented metrics, or template team
          bios. When case studies are ready, they will be real. Until then, the
          work speaks through process, capabilities, and conversation.
        </p>
        <p>
          Reach us at{" "}
          <a href={`mailto:${SITE.email}`} style={{ color: "var(--accent)" }}>
            {SITE.email}
          </a>{" "}
          or {SITE.phone}.
        </p>
      </div>
    </div>
  );
}
