# Website Revamp - TODO

**Deadline:** the original target was live by 22 September 2026 (before Freshers Fair). Reconciled 10 Nov 2026 from the repo and live checks only; the site is deployed (see Phase 0 and 3 below). Items marked "unverified, ask the society" could not be checked from the repo or the public site.
**Full spec:** See `spec.md`
**Cloud:** AWS (existing account)
**CMS:** Sanity (hosted Studio at icats.sanity.studio)
**Run locally:** `npm run dev`

## Phase 0: Foundations (Now - April 2026)

- [x] Get AWS account access from current Head of Tech (inferred: the S3/CloudFront deploy workflow runs successfully; the Head can confirm)
- [x] Get brand colours, logos and font guidelines from Heads of Marketing (brand.md exists and is applied; logo and font files unverified, ask the society)
- [x] Set up GitHub repo (it is public, josh-g-s/algosoc_website, not private as first planned)
- [x] Set up AWS hosting: S3 bucket `algosoc-website` + CloudFront `E33QZJV3IBVAJ8` (private bucket via OAC, eu-west-2)
- [ ] Set up remaining AWS infrastructure: RDS PostgreSQL, SES (unverified, ask the society; nothing in the repo uses either yet)
- [x] Write developer onboarding README (README.md and CLAUDE.md exist)
- [ ] Recruit 3-5 developers (unverified, ask the society)
- [ ] (Nice to have) Request Entra ID app registration from ICT for future SSO

## Phase 1: Remaining (before devs join)

- [ ] Set the "Join via Imperial College Union" URL in Sanity (`joinPage.ctaUrl`; falls back to `#` when unset). Still open: the live /join page has a `#` link (checked 10 Nov 2026). Society-owned content
- [x] Favicon: `public/favicon.ico` and `favicon.svg` are in and linked on the live site
- [ ] Web manifest: none in the repo, and /manifest.webmanifest returns 404 live
- [ ] Wire up newsletter signup form (API route + SES or subscriber table). Still open: the home-page form has no action or handler. Needs a backend, since the site is static
- [ ] Wire up contact page email form (API route + SES). Still open: the form has no action or handler (a mailto link exists). Needs a backend
- [ ] Scheduled rebuilds (GitHub Actions cron) for publishDate/expiryDate to take effect. Still open: `deploy.yml` triggers only on push and repository_dispatch. Changing it needs the Head's OK
- [ ] Calendar view for events (month grid) - nice to have
- [ ] Content dashboard at /admin/content showing status of all content (active/scheduled/expired) - nice to have

## Phase 2: Dynamic Features (July - August 2026)

- [ ] Individual event pages (`/events/[slug]`). Still open: only `src/pages/events.astro` exists
- [x] Programme subpages (`/programmes/algothon`, `/programmes/algocourse`, `/programmes/queens-tower-exchange`, plus bootcamp, markets-101, weekly-quant-sessions). Verified: all in `src/pages/programmes/`, and queens-tower-exchange is live
- [ ] Auth for Fantasy League + admin (restricted to @ic.ac.uk)
- [ ] Points system backend (database schema, admin API routes)
- [ ] Leaderboard page (live data replacing current mock)
- [ ] Admin pages (points entry, CSV import, user management)
- [ ] Newsletter email automation (Lambda/cron + SES)
- [ ] Fantasy League top-10 API integration on landing page
- [ ] iCal export for events

## Phase 3: Polish & Launch (1-22 September 2026)

- [ ] Content population via Sanity: committee bios/LinkedIn, updated sponsor logos/tiers, initial blog posts, resources
- [ ] Cross-browser + mobile testing (Chrome, **Safari**, Edge, iOS, Android). Unverified, ask the society
- [ ] Performance audit (Lighthouse > 90). Unverified, no record in the repo
- [ ] Accessibility audit. Unverified, no record in the repo
- [ ] SEO validation (Search Console, structured data). A sitemap and robots.txt are live; the rest is unverified, ask the society
- [ ] Security review (env vars, auth flows). Unverified. Note: `npm audit --omit=dev` showed 2 critical and 27 high advisories on 10 Nov 2026, mostly build tooling; see PR #19
- [x] Update Route 53 records to point at CloudFront. Verified 10 Nov 2026: www.algosoc.com returns 301 to https://algosoc.com/, which serves this repo's site from CloudFront and S3 (title and favicon match, content last modified on the 4 Aug deploy)
- [ ] Final QA with Heads of Marketing + President (unverified, ask the society)

## Dependencies (waiting on other people)

- [ ] AWS account handover from current Head of Tech (need by April)
- [ ] Brand guidelines + favicon/icon from Heads of Marketing (need by April)
- [ ] Full names, role titles, LinkedIn URLs, headshots, bios from all committee members (need by 15 Aug)
- [ ] Sponsor logos + tier assignments from Sponsorship Managers (need by Aug)
- [ ] ICWiT leadership info + sponsors (need by Aug)
- [ ] Event calendar (Term 1) from Head of Events (need by Sep)
- [ ] Blog/newsletter content from Heads of Marketing (need by Sep)
- [ ] Bootcamp/AlgoCourse materials from Heads of Trading (need by Sep)
- [ ] Content for each programme item (Algothon, AlgoCourse, Queens Tower Capital descriptions, images, stats)
- [ ] Points allocation rules from President + Head of Events (need by Jul)
