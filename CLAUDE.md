# AlgoSoc Website

Astro 6 static site for the Imperial College Algorithmic Trading Society. Must be live by **22 September 2026**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static output), TypeScript |
| Styling | Tailwind CSS 4 (PostCSS transformer) |
| CMS | Sanity (hosted, project `bd3zp068`, dataset `production`) |
| Fonts | Archivo (headings), Albert Sans (body) |
| Hosting | AWS S3 + CloudFront (private bucket via OAC), deployed by GitHub Actions from `main` |
| Live chart | Canvas-based candlestick pulling from Yahoo Finance API |

## Running Locally

```bash
npm install

# Development (localhost only)
npm run dev

# Production build + preview (required for LAN/device testing)
npm run build && npm run preview
```

**LAN testing:** Always use `npm run build && npm run preview`. The dev server is not reliable over LAN.

## Branding

See [brand.md](brand.md) for colours, typography, and usage rules. Never hardcode hex values in components.

## Code Style

- TypeScript strict mode is enabled.
- Use Tailwind for styling. No inline styles except for truly dynamic values.
- Path alias: `@/*` maps to `./src/*`.
- No em-dashes anywhere in the codebase or documentation.

## No Hardcoded Content

All displayable data must come from Sanity. The only non-CMS data is `navItems` in `src/lib/data.ts`. Stats must go through `getStats()` in `lib/content.ts`, never imported directly.

Editable page copy (headings, intros, CTAs, empty-state messages) lives in per-route singleton documents (see [Page Content Pattern](#page-content-pattern)). The original strings remain in the `.astro` templates only as fallbacks for build resilience, not as the source of truth.

## Shared Utilities

| Module | Purpose |
|--------|---------|
| `lib/categories.ts` | Colour and label maps for blog, event, and resource categories |
| `lib/content.ts` | `isPublished()`, `getStats()`, `todayISO()` |
| `lib/format.ts` | `formatDate()`, `formatDateLong()` for consistent date display |
| `lib/data.ts` | Navigation items only |
| `lib/sanity.ts` | Sanity client instance |

## Browser Compatibility

All UI changes must be tested in: **Safari (desktop and mobile)**, **Chrome**, and **Microsoft Edge**. Safari is particularly important as many Imperial students use macOS/iOS. Also test **dark mode** in all three browsers.

## Git Workflow

- **Never deploy from a non-main branch.** The GitHub Actions deploy workflow runs only on `main`.
- Feature branches + pull requests required. No committing directly to `main` for code changes.
- **Never force push to `main`.**
- Commit messages: imperative mood, concise, describe the "why" not the "what".
- Never commit `.env` or secrets.

## Documentation

- When making code changes, always update any affected documentation: `CLAUDE.md`, `brand.md`, `todo.md`, `spec.md`.
- `AGENTS.md` points to `CLAUDE.md` as the single source of truth. Do not duplicate content into `AGENTS.md`.

## Sanity CMS

### Schema Location

All schemas live in `src/sanity/schemas/`. The index at `src/sanity/schemas/index.ts` re-exports them all.

| Schema | Type | Notes |
|--------|------|-------|
| `homePage` | document | Home page editable copy (hero heading/subheading/CTAs, section heading+intro pairs). Singleton. Dynamic data (events, programmes, sponsors, stats, live chart) is not stored here. The page falls back to default copy if a field is empty. |
| `sponsorsPage` | document | Sponsors page editable copy (header, group headings, per-tier description/amount via `tierCopy`, CTA box). Singleton. Tier keys/names/order are fixed in `sponsors.astro`; `tierCopy` only overrides text per tier. Logos and tier assignments come from `sponsor`. Falls back to default copy. |
| `resourcesPage` | document | Resources page editable copy (heading, intro, empty-state message). Singleton. Resource cards come from `resource`. Falls back to default copy. |
| `eventsPage` | document | Events page editable copy (heading, intro, empty-state message). Singleton. Event cards come from `event`. Falls back to default copy. |
| `programmesPage` | document | Programmes index editable copy (heading, intro, empty-state). Singleton. Programme cards come from `programme`; each subpage renders from its own `programme` doc. Falls back to default copy. |
| `algothonPage` | document | Algothon landing header copy (heading, intro, empty-state) for `/programmes/algothon`. Singleton. Editions come from `algothon`. Falls back to default copy. |
| `newsPage` | document | News & Research index editable copy (heading, intro, empty-state). Singleton. Feed items come from `post`, `newsletter`, `marketRecap`; filter labels stay in code. Falls back to default copy. |
| `witPage` | document | ICWiT page editable copy (heading, intro, Instagram URL/handle, section headings, leadership empty-state). Singleton. Intro supports `{members}` and `{events}` tokens for live ICWiT stats. Events come from `witEvent`, leadership from `teamMember` (division "icwit"). Falls back to default copy. |
| `committeePage` | document | Committee page editable copy (heading, intro, AlgoSoc/ICWiT section headings + empty-states) for `/about/committee`. Singleton. Member cards come from `teamMember`, split by `division`. Falls back to default copy. |
| `post` | document | Blog posts (research, announcements). Author is a reference to `teamMember`. |
| `newsletter` | document | Weekly newsletter issues. Editor + co-authors are references to `teamMember`. Sectioned body, featured links, references to upcoming events. |
| `marketRecap` | document | Weekly market and quant recap. Authors are references to `teamMember`. Includes `keyMetrics`, `movers`, `macroEvents`, `tradingViewCharts` (live embeds with custom start/end + interval), `quantSection`. |
| `event` | document | Events (has `attendees` count field) |
| `teamMember` | document | Committee members (`photoUrl` is a URL, not image) |
| `sponsor` | document | Sponsors (`logo` is a Sanity image asset) |
| `sponsorAlgothon` | document | Algothon-specific sponsors (same fields as `sponsor`) |
| `resource` | document | Resources |
| `programme` | document | Programmes (stats are value/label pairs, optional curriculum grid, highlights) |
| `algothon` | document | Algothon editions (year, images carousel, sponsors, participants, recap) |
| `siteConfig` | document | Site-wide config and stats |
| `witEvent` | document | WIT recurring event types (title + description) |
| `aboutPage` | document | About page content (mission statement, "What We Do" pillars). Singleton. Pillar descriptions support `{partners}` token for live sponsor count. |
| `joinPage` | document | Join page content (heading, intro, CTA label/URL/note). Singleton. Programmes and events are auto-populated from their respective document types. |

### Schema Change Workflow

When you modify a schema file in `src/sanity/schemas/`:

1. **Deploy the Studio** so the hosted Sanity Studio UI shows the new/changed fields:
   ```bash
   npx sanity deploy
   ```
2. **Rebuild the site** so Astro fetches data with the updated shape:
   ```bash
   npm run build && npm run preview
   ```

**Important:** `npx sanity schema deploy` only pushes the schema to the GraphQL API. To update the Studio UI (where editors add content), you must run `npx sanity deploy`.

### Studio Structure

The Studio sidebar uses a custom desk structure defined in `sanity.config.ts` (the `structureTool({ structure })` callback), modelled on the Queen's Tower Exchange Studio:

- A **Pages** folder groups the per-route page documents (the `*Page` singletons). They are opened directly via `S.document().documentId(...)`. See [Page Content Pattern](#page-content-pattern) for how page copy is modelled and how to add a page.
- Collections (Programmes, Events, News & Research, Team Members, Sponsors, etc.) and **Site Configuration** sit at the top level alongside Pages. Collections hold the data shown on pages; the `*Page` singletons hold only the surrounding copy.
- **Singletons** (every `*Page` document plus `siteConfig`) are listed in the `singletons` array and hidden from the global "Create" menu so editors cannot make duplicates, which would break the `[0]` queries the site uses to fetch them.

Changes to the structure require `npx sanity deploy` to appear in the hosted Studio. They do not change document shape, so no site rebuild is needed. When adding a new page singleton, give it a fixed `_id` (see `scripts/create-about-page.mjs`) so the structure can open it directly.

### Page Content Pattern

Each route's editable copy (headings, intros, section labels, CTAs, empty-state messages) lives in its own **per-route singleton document** named `<route>Page` (e.g. `homePage`, `eventsPage`, `witPage`). These are the documents under the Studio **Pages** folder. The actual content shown on a page (event cards, programme entries, team members, sponsor logos, etc.) comes from separate **collection** document types, never the page singleton.

**Page singletons and the collections they display**

| Page singleton (copy) | Route | Collection(s) shown |
|-----------------------|-------|---------------------|
| `homePage` | `/` | `event`, `programme`, `sponsor` + stats |
| `aboutPage` | `/about` | (copy only) + stats |
| `committeePage` | `/about/committee` | `teamMember` (split by `division`) |
| `eventsPage` | `/events` | `event` |
| `programmesPage` | `/programmes` | `programme` |
| `algothonPage` | `/programmes/algothon` | `algothon` |
| `newsPage` | `/news-and-research` | `post`, `newsletter`, `marketRecap` |
| `sponsorsPage` | `/sponsors` | `sponsor` (+ `sponsorAlgothon`) |
| `resourcesPage` | `/resources` | `resource` |
| `witPage` | `/wit` | `witEvent`, `teamMember` (icwit) + stats |
| `joinPage` | `/join` | `programme`, `event` (auto-populated) |

Several collections feed more than one page: `teamMember` → committee + WiT; `event` → events + home + join; `sponsor` → sponsors + home; `programme` → programmes + home + join. `siteConfig` is global, not a page. The five `programme`-backed subpages (AlgoCourse, Bootcamp, Markets 101, Queen's Tower Capital, Weekly Quant Sessions) have no page singleton: each renders entirely from its own `programme` document (title, description, stats, curriculum, body).

**Conventions**

- **Fixed `_id`**: each page singleton uses a fixed `_id` equal to its schema name (e.g. `homePage`), so the structure opens it directly. The one exception is `siteConfig` (auto-generated id, referenced by type).
- **Fallbacks**: every page fetches `*[_type == "<route>Page"][0]` and renders each field with the original hardcoded string as a fallback (`page?.heading ?? "Events"`). This keeps the build working before the document is seeded and resilient to empty fields. When changing default copy, update **both** the `.astro` fallback and the seed script.
- **Seed scripts**: each page has `scripts/create-<route>-page.mjs` that creates/updates the document with the current copy. Run with `SANITY_TOKEN=<token> node scripts/create-<route>-page.mjs`. Exception: `create-programmes-page.mjs` seeds both `programmesPage` and `algothonPage`.
- **Tokens in copy**: intro/description text can embed `{token}` placeholders replaced with live stats at render time: `{partners}` (aboutPage pillars), `{members}` and `{events}` (witPage intro). Replacement happens in the page's `.astro` frontmatter.

**Adding or migrating a page**

1. Create `src/sanity/schemas/<route>Page.ts` (document type; fields for the editable copy; use `fieldsets` to group related fields).
2. Register it in `src/sanity/schemas/index.ts` (import + add to `schemaTypes`).
3. Add it to the **Pages** folder and the `singletons` array in `sanity.config.ts`.
4. Add `scripts/create-<route>-page.mjs` seeding the current copy with a fixed `_id`.
5. Wire the `.astro` page: fetch the doc, replace hardcoded copy with `page?.field ?? "<original>"` fallbacks. Keep dynamic data (collections, stats) untouched.
6. Add a row to the schema table above; build with `npm run build` and `npx sanity build`.
7. After merge: `npx sanity deploy`, then run the seed script.

**Still hardcoded (not yet migrated)**

- `/newsletter` (`newsletter/index.astro`) and `/market-recap` (`market-recap/index.astro`) listing-page headers.
- The `[slug]` detail templates (`post`, `newsletter`, `marketRecap`) render content documents directly and have only structural labels.
- Per-page SEO `description` (meta) and the headline stat **labels** (e.g. "Members", "Events Hosted") are intentionally left in the templates.

**Planned: full consolidation under Pages**

The intent is to make the Studio sidebar's top level just the **Pages** folder, nesting collections under their page. This is a `sanity.config.ts` structure-only change (no schema or data change). Open decision:

- **Full nest**: most minimal sidebar, but shared collections (`teamMember`, `event`, `sponsor`, `programme`) land under a single page even though they are used on several.
- **Hybrid**: nest only the page-specific collections (`algothon`, `resource`, `witEvent`) under their page; keep shared collections and `siteConfig` at the top level.

Do **not** consolidate by embedding collection data inside page documents: that loses references and reuse, makes editing clunky, and breaks the derived stat counts.

### Derived Stats

Some stats on the website are computed automatically from Sanity document counts. Do NOT add manual fields for these in siteConfig:

| Stat | Source | Query |
|------|--------|-------|
| Industry Partners | Sponsor count | `count(*[_type == "sponsor"])` |
| Events Hosted | Event count | `count(*[_type == "event"])` |
| ICWiT Events | ICWiT event count | `count(*[_type == "event" && category == "icwit"])` |

All other stats (members, founded, offers, etc.) are manually set in the **Site Configuration** document under Key Statistics.

### Data Import Scripts

Import scripts live in `scripts/`. They require a `SANITY_TOKEN` env var with Editor permissions.

```bash
SANITY_TOKEN=<token> node scripts/import-sponsors.mjs
```

## Environment Variables

Required in `.env` (not committed - see `.gitignore`):

| Variable | Purpose |
|----------|---------|
| `SANITY_PROJECT_ID` | Sanity project ID |
| `SANITY_DATASET` | Sanity dataset name |
| `SANITY_TOKEN` | Write token (only needed for import scripts, not for builds) |

Ask a team member for the values, or find them in the Sanity dashboard (manage.sanity.io). The project ID and dataset are not secrets - Sanity's Content API is public for published documents by default, so no authentication is needed for reads. Only `SANITY_TOKEN` (for write operations) is a true secret.

The Sanity client in `src/lib/sanity.ts` falls back to a stub if `SANITY_PROJECT_ID` is missing, allowing builds without Sanity configured (pages will have empty content).
