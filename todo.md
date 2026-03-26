# Website Revamp - TODO

**Deadline:** Live by 22 September 2026 (before Freshers Fair, first week of October)
**Full spec:** See `spec.md`
**Cloud:** AWS (existing account)
**CMS:** Sanity (hosted Studio at icats.sanity.studio)
**Run locally:** `npm run dev`

## Phase 0: Foundations (Now - April 2026)

- [ ] Get AWS account access from current Head of Tech
- [ ] Get brand colours, logos and font guidelines from Heads of Marketing
- [ ] Set up GitHub repo (private)
- [ ] Set up AWS infrastructure: Amplify project, RDS PostgreSQL, SES
- [ ] Write developer onboarding README
- [ ] Recruit 3-5 developers
- [ ] (Nice to have) Request Entra ID app registration from ICT for future SSO

## Phase 1: Remaining (before devs join)

- [ ] Get URL for "Join via Imperial College Union" button on /join page (currently links to `#`)
- [ ] Favicon + web manifest (blocked on icon asset from Marketing)
- [ ] Wire up newsletter signup form (API route + SES or subscriber table)
- [ ] Wire up contact page email form (API route + SES)
- [ ] Scheduled rebuilds (GitHub Actions or Amplify cron) for publishDate/expiryDate to take effect
- [ ] Calendar view for events (month grid) - nice to have
- [ ] Content dashboard at /admin/content showing status of all content (active/scheduled/expired) - nice to have

## Phase 2: Dynamic Features (July - August 2026)

- [ ] Individual event pages (`/events/[slug]`)
- [ ] Programme subpages (`/programmes/algothon`, `/programmes/algocourse`, `/programmes/queens-tower-capital`)
- [ ] Auth for Fantasy League + admin (restricted to @ic.ac.uk)
- [ ] Points system backend (database schema, admin API routes)
- [ ] Leaderboard page (live data replacing current mock)
- [ ] Admin pages (points entry, CSV import, user management)
- [ ] Newsletter email automation (Lambda/cron + SES)
- [ ] Fantasy League top-10 API integration on landing page
- [ ] iCal export for events

## Phase 3: Polish & Launch (1-22 September 2026)

- [ ] Content population via Sanity: committee bios/LinkedIn, updated sponsor logos/tiers, initial blog posts, resources
- [ ] Cross-browser + mobile testing (Chrome, **Safari**, Edge, iOS, Android)
- [ ] Performance audit (Lighthouse > 90)
- [ ] Accessibility audit
- [ ] SEO validation (Search Console, structured data)
- [ ] Security review (env vars, auth flows)
- [ ] Update Route 53 records to point at Amplify
- [ ] Final QA with Heads of Marketing + President

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
