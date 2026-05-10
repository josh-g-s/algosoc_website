# AlgoSoc Website

Astro + Sanity CMS rebuild of the AlgoSoc website. Static output hosted on S3 + CloudFront, with automatic rebuilds triggered by Sanity content changes.

**Preview:** https://d3arqmzuctjtc5.cloudfront.net/ (CloudFront default URL; production DNS at `www.algosoc.com` cuts over later)

[![Build & Deploy](https://github.com/josh-g-s/algosoc_website/actions/workflows/deploy.yml/badge.svg)](https://github.com/josh-g-s/algosoc_website/actions/workflows/deploy.yml)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static output), TypeScript strict |
| Styling | Tailwind CSS 4 |
| CMS | Sanity (hosted Studio at algosoc.sanity.studio) |
| Fonts | Archivo (headings), Albert Sans (body) |
| Hosting | AWS S3 + CloudFront (private bucket via OAC) |
| CI/CD | GitHub Actions (build + deploy on content change) |

## Local Development

```bash
npm install
npm run dev       # Dev server at localhost:4321 - fetches fresh Sanity data on each request
npm run build     # Production build to dist/
npm run preview   # Preview the production build locally
```

## Environment Variables

Create a `.env` file with:

```
SANITY_PROJECT_ID=<project-id>
SANITY_DATASET=<dataset>
```

Ask a team member for the values, or find them in the Sanity dashboard (manage.sanity.io). These are only needed at build time and are not shipped to the browser.

**Note:** The project ID and dataset name are not secrets. Sanity's Content API is public for published documents by default - no authentication is required to read published content. The only secret is `SANITY_TOKEN`, which is needed for write operations (e.g. import scripts) and is never committed to the repo.

## Sanity Studio

- **URL**: https://algosoc.sanity.studio/

Content types: Blog Posts, Events, Team Members, Sponsors, Resources, Programmes, WIT Events, Site Config (singleton).

To redeploy the Studio after schema changes:

```bash
npx sanity deploy
```

## Content Publishing Workflow

Content changes in Sanity do not appear on the live site immediately. The site is statically built, so a rebuild is required. The workflow:

```
Editor publishes in Sanity Studio
        |
        v
Sanity webhook fires HTTP POST to GitHub Actions API
        |
        v
GitHub Actions workflow runs:
  1. Checks out the repo
  2. Installs dependencies
  3. Runs `astro build` (fetches latest content from Sanity)
  4. Syncs dist/ to S3
  5. Invalidates CloudFront cache
        |
        v
Site is live with new content (~1-2 minutes)
```

### Current Setup

The deployment pipeline is already configured. The canonical workflow lives at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Reference details:

| Component | Value |
|-----------|-------|
| Trigger | Push to `main`, manual dispatch, or `repository_dispatch` type `sanity-publish` |
| Build | Node 22, `npm ci`, `npm run build` (Astro static output to `dist/`) |
| Target bucket | `s3://algosoc-website` (eu-west-2, private, served via OAC) |
| CloudFront distribution | `E33QZJV3IBVAJ8` (default URL `https://d3arqmzuctjtc5.cloudfront.net`) |
| Cache strategy | Hashed assets `max-age=31536000, immutable`; HTML, sitemap, and `robots.txt` `max-age=0, must-revalidate` |
| Post-sync | Full `/*` CloudFront invalidation |
| IAM identity | IAM user `github-icats-deploy` with least-privilege inline policy (S3 read/write on the bucket + `cloudfront:CreateInvalidation` on this distribution only) |

### Required GitHub Secrets

These are already set on the repo. Listed here so they can be re-created if rotated.

| Secret | Notes |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | Access key for IAM user `github-icats-deploy` |
| `AWS_SECRET_ACCESS_KEY` | Corresponding secret |
| `SANITY_PROJECT_ID` | Sanity project ID (`bd3zp068`) |
| `SANITY_DATASET` | Sanity dataset (`production`) |

The bucket name and distribution ID are intentionally hardcoded in `deploy.yml` rather than stored as secrets, since they are not sensitive.

### Sanity Webhook (Auto-Rebuild on Content Change)

Configure a webhook in Sanity (manage.sanity.io > project > API > Webhooks) to trigger a deploy whenever content is published:

| Field | Value |
|-------|-------|
| Name | Deploy Website |
| URL | `https://api.github.com/repos/josh-g-s/algosoc_website/dispatches` |
| HTTP method | POST |
| Header | `Authorization: Bearer <github-pat>` |
| Header | `Accept: application/vnd.github.v3+json` |
| Body | `{"event_type": "sanity-publish"}` |
| Trigger on | Create, Update, Delete |
| Dataset | `production` |

The PAT should be a fine-grained token from the `josh-g-s` GitHub account, scoped to `josh-g-s/algosoc_website` only, with `Contents: Read & Write` and `Metadata: Read`.

### Manual Rebuild

```bash
gh workflow run deploy.yml --repo josh-g-s/algosoc_website
```

### Usage Limits

GitHub Actions free tier for private repos: 2,000 minutes/month. Each rebuild takes ~1.5 minutes, so roughly 1,300 deploys/month. Publishing content 40+ times per day every day would be needed to approach this limit. (The repo is currently public, which has unlimited Actions minutes.)

## Project Structure

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
  sanity/schemas/       Sanity schema definitions
sanity.config.ts        Sanity Studio config
sanity.cli.ts           Sanity CLI config
astro.config.mjs        Astro config
postcss.config.mjs      Tailwind/PostCSS config
.github/workflows/      GitHub Actions (deploy.yml)
```

## Client-Side JavaScript

All components are native Astro (`.astro` files) with no React. The site ships zero client-side JS frameworks. Interactive behaviour (mobile menu, chart animation) uses inline `<script>` tags.
