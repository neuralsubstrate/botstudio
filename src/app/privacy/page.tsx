import type { Metadata } from "next";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="shell page-hero">
      <p className="kicker">Legal</p>
      <h1>Privacy</h1>
      <div className="prose-stub" style={{ marginTop: 32 }}>
        <p>
          This is a placeholder privacy notice for {SITE.legal} ({SITE.name}),
          operating from {SITE.location}. A full policy will replace this stub
          before public launch.
        </p>
        <p>
          Contact for privacy requests:{" "}
          <a href={`mailto:${SITE.email}`} style={{ color: "var(--accent)" }}>
            {SITE.email}
          </a>
          .
        </p>
        <ul className="legal-list">
          <li>We collect only what you send us (email, forms, project materials).</li>
          <li>We do not sell personal data.</li>
          <li>Hosting and analytics vendors will be listed when production tooling is finalized.</li>
        </ul>
      </div>
    </div>
  );
}
