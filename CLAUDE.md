# ICATS Website

Astro 6 static site for the Imperial College Algorithmic Trading Society. Must be live by **22 September 2026**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static output), TypeScript |
| Styling | Tailwind CSS 4 (PostCSS transformer) |
| CMS | Sanity (hosted, project `bd3zp068`, dataset `production`) |
| Fonts | Archivo (headings), Albert Sans (body) |
| Hosting | AWS Amplify (from `main` branch) |
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

- **Never deploy from a non-main branch.** Amplify deploys from `main`.
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
| `post` | document | Blog posts |
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
