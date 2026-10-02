/** Shared Botlane Studios copy — honest facts only, no fake portfolio. */

export const SITE = {
  name: "Botlane Studios",
  legal: "BotLane LLC",
  tagline: "Ultra-premium websites",
  location: "Sheridan, WY",
  email: "admin@botlane.io",
  phone: "+1 307 218 5715",
  phoneTel: "+13072185715",
  whatsapp: `https://wa.me/13072185715?text=${encodeURIComponent(
    "Hi Botlane Studios, I'd like to talk about a project.",
  )}`,
  domainsNote:
    "Currently botlane.tech — moving to botlane.studio. botlane.io is the product company site (separate).",
} as const;

export const NAV = [
  { href: "/", label: "Studio" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
] as const;

export const CAPABILITIES = [
  {
    index: "01",
    eyebrow: "Foundation",
    slug: "brand-identity",
    title: "Brand Identity",
    bullets: [
      "Visual systems that hold under product pressure",
      "Wordmark, type, and color with real usage rules",
      "Assets ready for web, product, and pitch",
    ],
  },
  {
    index: "02",
    eyebrow: "Direction",
    slug: "strategy",
    title: "Strategy",
    bullets: [
      "Audience, offer, and narrative clarity",
      "Information architecture before pixels",
      "Messaging that converts without hype",
    ],
  },
  {
    index: "03",
    eyebrow: "Craft",
    slug: "design-innovation",
    title: "Design & Innovation",
    bullets: [
      "Interface design with motion that earns its keep",
      "Design systems that developers can ship",
      "Exploration that stays on brand",
    ],
  },
  {
    index: "04",
    eyebrow: "Intelligence",
    slug: "ai-systems",
    title: "AI Systems",
    bullets: [
      "Practical AI surfaces for content and ops",
      "Workflows that respect your data boundaries",
      "Assistive tooling, not gimmicks",
    ],
  },
  {
    index: "05",
    eyebrow: "Discovery",
    slug: "seo",
    title: "SEO",
    bullets: [
      "Technical foundations search engines trust",
      "Content structure for lasting findability",
      "Measurement without vanity dashboards",
    ],
  },
  {
    index: "06",
    eyebrow: "Build",
    slug: "development",
    title: "Development",
    bullets: [
      "Next.js / modern web stacks, production-ready",
      "Performance, accessibility, and maintainability",
      "Handoff that does not collapse after launch",
    ],
  },
] as const;

export const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    body: "We listen first — goals, constraints, audience, and what “premium” means for you.",
  },
  {
    step: "02",
    title: "Strategy",
    body: "Structure, messaging, and a clear plan so design is never guessing.",
  },
  {
    step: "03",
    title: "Design and Build",
    body: "High-fidelity craft and production engineering in one loop, not a handoff cliff.",
  },
  {
    step: "04",
    title: "Launch and Grow",
    body: "Ship cleanly, then iterate on what the market actually teaches you.",
  },
] as const;

export const PLANS = [
  {
    name: "Essential",
    watermark: "01",
    blurb: "A focused marketing site with clear narrative and polished craft.",
    features: [
      "Up to ~8 key pages",
      "Brand-aligned UI system",
      "Responsive build",
      "Basic SEO foundations",
      "Launch support",
    ],
  },
  {
    name: "Signature",
    watermark: "02",
    featured: true,
    blurb: "Flagship presence — richer motion, deeper content model, stronger systems.",
    features: [
      "Expanded page set & templates",
      "Custom interaction / motion",
      "Content model & CMS path",
      "Performance & a11y pass",
      "Post-launch iteration window",
    ],
  },
  {
    name: "Studio",
    watermark: "03",
    blurb: "Ongoing partnership for brands that treat the site as a living product.",
    features: [
      "Retainer or multi-phase scope",
      "Design + engineering continuity",
      "Experimentation & growth work",
      "Priority support",
      "Roadmap ownership",
    ],
  },
] as const;
