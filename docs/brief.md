# ISAR Unfiltered 2026 — Cursor Build Brief
### One-page scrollytelling site · reference: zajno.com, but bolder

## 1. Creative direction

**Reference:** zajno.com — but push it bolder. Zajno is refined/quiet-confident; we want the same scroll craft with more weight: bigger type, harder color blocks, grainier photography, less whitespace-as-luxury. Think Swiss poster meets Berlin club flyer, not Zurich design agency.

- Deep green `#02462e` and yellow `#fec700` as hard blocks, not gradients or tints. No pastel versions of these colors, ever.
- Condensed/slab display type, oversized, often cropped by its container on purpose.
- Black & white grainy/blurred photography — motion blur, not polish.
- Short, direct copy. Tone rules live in the copysheet: build, ship, do, unfiltered, real, proof. Never: visionary, ecosystem, disruptive, empowering, game-changing.
- Kinetic type is the main character. Scroll should feel like it's *revealing, cropping, and slamming* text into place — not gently fading it in.

## 2. Tech stack

| Purpose | Tool |
|---|---|
| Framework | **Next.js 15** (App Router) — no backend needed |
| Styling | **Tailwind CSS** |
| Scroll engine | **GSAP + ScrollTrigger** |
| Smooth scroll | **Lenis** — wraps native scroll, feeds GSAP |
| Text effects | **React Bits** via jsrepo CLI |
| Text splitting | **SplitType** |
| Light UI motion | **Motion for React** — simple in-view fades on non-hero sections only |
| Fonts | Adobe Fonts kit `lpk6vqu` — Zuume + Helvetica Neue LT Pro. Do not self-host. |
| Images | `next/image` + CSS/SVG grain overlay |

Do not introduce a second scroll library, a second animation library, or CSS-only scroll-driven animations. GSAP + Lenis is the whole system.

## 3. Fonts (locked)

Adobe kit: `https://use.typekit.net/lpk6vqu.css`

- Display: `"zuume"` 400 / 700 / 900
- Body: `"helvetica-neue-lt-pro"`
- Labels: `"helvetica-neue-lt-pro-cond"` 700 / 900

Hero uses SplitText (snap/settle), not TextPressure — the kit ships static weights, not the variable file.

Add the production domain to the Adobe web project before launch.

## 4. Copy source

`Contents/isar-unfiltered-copysheet.md` → `lib/copy.ts`

Locked directions: Hero A, marquee `ANNOYED — CURIOUS — BORED —`.

## 5. Section order

00 Nav → 01 Hero → 02 Marquee → 03 Manifesto → 04 Gallery → 05 Scholarship (pinned) → 06 Who gets in → 07 Contrast → 09 Apply → 10 Footer → 08 Quotes last.

Build one section at a time. Static layout first, ScrollTrigger last.

## 6. Performance & accessibility

- `prefers-reduced-motion`: every GSAP timeline has a static fallback.
- Lazy-init ScrollTriggers per-section.
- Lenis driven from `gsap.ticker` (`autoRaf: false`) + `lenis.on('scroll', ScrollTrigger.update)`.
- Test pinned sections on mobile Safari. Scholarship pin is desktop-only; mobile is a vertical stack.
