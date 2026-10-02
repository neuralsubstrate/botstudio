import type { Metadata } from "next";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <div className="shell page-hero">
      <p className="kicker">Legal</p>
      <h1>Terms</h1>
      <div className="prose-stub" style={{ marginTop: 32 }}>
        <p>
          Placeholder terms of use for {SITE.legal}, {SITE.location}. These
          stubs are not a substitute for counsel-reviewed agreements.
        </p>
        <ul className="legal-list">
          <li>Site content is provided as-is for informational purposes.</li>
          <li>Project work is governed by a separate statement of work or MSA.</li>
          <li>
            Questions:{" "}
            <a href={`mailto:${SITE.email}`} style={{ color: "var(--accent)" }}>
              {SITE.email}
            </a>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
