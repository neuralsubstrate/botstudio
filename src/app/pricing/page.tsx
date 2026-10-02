import type { Metadata } from "next";
import { Pricing } from "@/components/Pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Essential, Signature, and Studio plan shapes — tailored quotes, no invented sticker prices.",
};

export default function PricingPage() {
  return (
    <>
      <div className="shell page-hero" style={{ paddingBottom: 0 }}>
        <p className="kicker">Pricing</p>
        <h1>Structure first. Price from the brief.</h1>
        <p>
          Plan cards keep a clear shape; every engagement is quoted for your
          scope. We do not list invented package prices.
        </p>
      </div>
      <Pricing />
    </>
  );
}
