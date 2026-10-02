# Botlane Studios (`botstudio`)

Fresh Next.js scaffold for **Botlane Studios** — ultra-premium websites from Sheridan, WY. Built from Create® Figma / Framer layout audits (spacing, type, section rhythm), **not** a clone of the earlier `/workspace/bot-studio` tree.

**Repo:** https://github.com/botlaneio/botstudio

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- Figtree (Google / `next/font`) + Fragment Mono (`@fontsource/fragment-mono`)
- Lenis smooth scroll (optional; respects `prefers-reduced-motion`)
- Standard `next build` — no OpenNext / Cloudflare / Three.js in v1

> Production may later move to Cloudflare (OpenNext) like the prior bot-studio experiment. Keep deploy simple until then.

## Design tokens

| Token | Value |
|-------|--------|
| Accent | `#0077E6` (Botlane — **never** template coral `#FF6041`) |
| Dark bg | `#161719` / `#000000` |
| Neutrals | `#797D82`, `#5C6063`, `#D5D7DE` |
| Artboard | 1280px → CSS `--u` scale (`0.9` up to 1600px; stacks under 900) |
| Rhythm | gutter **40**, section pad **160**, header gap **112**, bento gap **24**, CTA radius **12**, nav **60** |

Audit reference (local): `figma-create-layouts-audit.md` on the agent workspace.

## Pages

| Route | Notes |
|-------|--------|
| `/` | Nav, Hero, manifesto strip, Craft placeholders, Capabilities, How we work, Pricing shell, Footer/Contact |
| `/about` | Studio stub |
| `/capabilities` | Shared capability list |
| `/pricing` | Plan cards with **Tailored quote** |
| `/privacy`, `/terms` | BotLane LLC / Wyoming placeholders |
| `404` | Minimal |

## Intentionally omitted (v1)

- Fake case studies / client names / portfolio copy
- Team, FAQ, testimonials, Whispers blog
- Fake performance metrics / Framer badges
- Invented dollar prices (`$2800` / `$6500` / `$12000` etc.)

## Contact

- Botlane Studios / BotLane LLC · Sheridan, WY
- admin@botlane.io · +1 307 218 5715 (WhatsApp-friendly)
- Domains: botlane.tech → botlane.studio; botlane.io is the product company site (separate)

## Local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

Node: whatever matches the lockfile (developed on Node 26 / npm 11).
