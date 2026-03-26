# ICATS Website Rebuild - Implementation Plan

## Context

The current algosoc.com is a static HTML site hosted on **AWS (S3 + CloudFront + Route 53)** with no CMS, no dynamic features, and outdated 2025 content. The 2026-27 action plan requires a full rebuild with: CMS-driven content, events calendar with RSVP, blog/newsletter, member resources, sponsor showcase, Fantasy League integration, points/leaderboard system, and ICWiT section. Site must be live by 22 September 2026 (before Freshers Fair).

**Current infrastructure:** Static HTML on S3, CloudFront CDN, Route 53 DNS, Google/Microsoft Forms for applications. No database, no auth, no CMS.

**Decision: Stay on AWS.** The account exists, DNS is there, and migrating clouds adds work that doesn't ship anything.

---

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Front-end | **Astro 6** (static output), TypeScript, Tailwind CSS 4 | Free |
| Hosting | **AWS Amplify** | Free tier |
| CMS | **Sanity** (hosted, project bd3zp068, Studio at icats.sanity.studio) | Free tier |
| Database | **AWS RDS PostgreSQL** (free tier) or **Supabase** (hosted on AWS) | Free tier or ~$15/mo |
| Auth | TBD for Fantasy League - email OTP restricted to @ic.ac.uk (MVP), Entra ID SSO later | Free |
| Storage | **S3** (already exists) | Pennies/month |
| Email | **AWS SES** | Very low volume cost |
| CDN | **CloudFront** (already exists) | Free tier |
| DNS | **Route 53** (already exists) | ~$0.50/mo |

---

## Site Architecture

```
algosoc.com/
  /                           Homepage (hero, stats, events preview, sponsors, newsletter signup)
  /about                      Mission, history, stats
  /about/committee             Committee grid with headshots/bios (filterable by division)
  /programmes                  All programmes overview
  /events                      Calendar + list view (filterable by category)
  /events/[slug]               Individual event page with RSVP link
  /blog                        Blog listing (newsletter, market recap, research)
  /blog/[slug]                 Individual post (rich text, LaTeX, embedded charts)
  /resources                   Member resources (bootcamp, notebooks, problem sets, reading lists)
  /sponsors                    ICATS tiers (Platinum/Gold/Silver/Bronze) + ICWiT tiers
  /wit                         ICWiT section (mission, leadership, sponsors, events)
  /fantasy-league              Landing page + link to league.algosoc.com
  /leaderboard                 Points leaderboard (public)
  /contact                     Contact form + social links + mailing list signup
  /join                        Redirect to Imperial Union signup
  /brand                       Brand guidelines reference page
```

---

## Sanity Content Types

| Type | Key Fields | Used By |
|------|-----------|---------|
| `post` | title, slug, author, body (portable text), category, publishDate | Blog |
| `event` | title, date, endDate, location, body, category, attendees, rsvpUrl | Events calendar |
| `teamMember` | name, role, division, bio, photoUrl, linkedIn, sortOrder | Committee, WiT pages |
| `sponsor` | name, tier, logo (image asset), websiteUrl, description | Sponsors page |
| `resource` | title, description, category, fileUrl, sortOrder | Resources page |
| `programme` | title, slug, description, body, stats | Programmes page |
| `witEvent` | title, description, sortOrder | WiT page recurring event types |
| `siteConfig` | contactEmail, stats (members, founded, offers, witMembers) | Global settings |

Stats for Industry Partners and Events Hosted are derived automatically from document counts.

---

## Key Features

### Auth
- **Website (main site):** No auth required. All content is public.
- **Fantasy League:** Requires accounts. MVP uses email magic link restricted to @ic.ac.uk.
- **Admin:** Requires accounts. Committee members log in; roles stored in database.
- **Leaderboard:** Public view. Points awarded by admins manually.
- **Newsletter signup:** Just an email input stored in the database. No account needed.

### Events Calendar
- List view (filterable by category)
- Category filters (Bootcamp, AlgoCourse, Trading Sim, Algothon, QTC, Social, ICWiT, etc.)
- RSVP links to external tools (Google Forms, Eventbrite)
- iCal export per event
- Past events archive

### Blog / Newsletter
- Rich text from Sanity portable text (headings, code blocks, images)
- Categories: Newsletter, Market Recap, Research, Announcements
- RSS feed at /rss.xml

### Member Resources
- Public access - no auth required
- Categories: Bootcamp, AlgoCourse, QTC, Reading Lists, Career Guides
- Files in S3

### Points / Leaderboard
- Database `points_ledger` table (append-only)
- Categories: event_attendance, competition, strategy_submission, content_contribution, fantasy_league
- Public leaderboard with opt-out
- Admin: manual entry + CSV import

### Fantasy League Integration
- Separate deployment at league.algosoc.com
- Has its own auth: email magic link (@ic.ac.uk), Entra SSO added later
- Main site fetches top-10 from Fantasy League API
- Landing page at /fantasy-league

---

## Database Schema

```sql
-- profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'member',
    show_on_leaderboard BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- points_ledger (append-only)
CREATE TABLE points_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    points INTEGER NOT NULL,
    description TEXT,
    event_id TEXT,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    awarded_by UUID REFERENCES profiles(id)
);

-- leaderboard view
CREATE VIEW leaderboard AS
SELECT p.id, p.display_name, p.show_on_leaderboard,
    COALESCE(SUM(pl.points), 0) AS total_points,
    RANK() OVER (ORDER BY COALESCE(SUM(pl.points), 0) DESC) AS rank
FROM profiles p
LEFT JOIN points_ledger pl ON p.id = pl.user_id
WHERE p.show_on_leaderboard = TRUE
GROUP BY p.id, p.display_name, p.show_on_leaderboard;

-- newsletter_subscribers
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);
```

---

## Development Phases

Task tracking lives in `todo.md`. Below is the phase structure for reference.

- **Phase 0 (Now - April 2026):** Foundations. Head of Technology solo. AWS access, brand guidelines, GitHub repo, infrastructure, developer recruitment.
- **Phase 1 (May - June 2026):** Core pages. Programme subpages, individual event pages, contact form + SES, scheduled rebuilds.
- **Phase 2 (July - August 2026):** Dynamic features. Auth, points system, live leaderboard, admin pages, newsletter automation, Fantasy League integration, iCal export.
- **Phase 3 (1-22 September 2026):** Polish and launch. Content population, cross-browser testing, performance/accessibility/SEO audits, DNS cutover, final QA.

---

## Dependencies on Other Roles

See `todo.md` for the live dependency checklist.

**Critical path items:** AWS account handover (blocks all infra) and brand guidelines (blocks all design).

---

## Risks

| Risk | Mitigation |
|------|-----------|
| AWS account handover delayed | Start conversations now; this is the single biggest blocker |
| Brand guidelines delayed | Use current site colours as interim (already extracted), adjust later |
| Committee members don't submit bios/photos | Hard deadline 15 Aug, placeholders for missing |
| Developers drop out | Head of Tech can build core pages solo; descope Phase 2 |
| Sponsor deals not finalised by Aug | Launch with confirmed sponsors, add via Sanity later |

---

## Repo Structure

```
public/                 Static assets (images, docs, favicon)
src/
  layouts/              BaseLayout.astro (HTML shell, branding, fonts)
  pages/                Astro pages (one per route)
  components/
    layout/             Header, Footer
    ui/                 LiveChart, FadeIn
    content/            MemberCard, SponsorLogo
  lib/                  Shared utilities (sanity client, categories, format, content, data)
  styles/               globals.css (Tailwind + brand tokens + custom CSS)
  sanity/schemas/       Sanity schema definitions (8 types)
scripts/                Data import scripts
CLAUDE.md               Agent instructions (single source of truth)
AGENTS.md               Points agents to CLAUDE.md
brand.md                Brand guidelines (colours, typography)
spec.md                 This file (architecture and feature spec)
todo.md                 Task tracker
sanity.config.ts        Sanity Studio config
sanity.cli.ts           Sanity CLI config
astro.config.mjs        Astro config
postcss.config.mjs      Tailwind/PostCSS config
```

---

## Verification

1. `npm run build` - no build errors
2. `npm run dev` - all pages render correctly
3. Lighthouse: Performance > 90, Accessibility > 90, SEO > 95
4. Sanity: create test content, rebuild, verify it appears on site
5. Email: test contact form submission arrives at algo.trade@imperial.ac.uk via SES
6. Mobile: test on iOS Safari and Android Chrome
7. Cross-browser: Chrome, Safari, Edge
