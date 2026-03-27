# ICATS Website

Astro + Sanity CMS rebuild of the ICATS website. Static output hosted on S3 + CloudFront, with automatic rebuilds triggered by Sanity content changes.

**Preview:** https://icats.z16.web.core.windows.net/

[![Build & Deploy](https://github.com/joshthecoder-hub/icats_website/actions/workflows/deploy.yml/badge.svg)](https://github.com/joshthecoder-hub/icats_website/actions/workflows/deploy.yml)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static output), TypeScript strict |
| Styling | Tailwind CSS 4 |
| CMS | Sanity (hosted Studio at icats.sanity.studio) |
| Fonts | Archivo (headings), Albert Sans (body) |
| Hosting | Azure Blob Storage (static website) |
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

- **URL**: https://icats.sanity.studio/

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

### Setup Steps

#### 1. GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in the repo:

```yaml
name: Build & Deploy

on:
  workflow_dispatch:     # Manual trigger
  repository_dispatch:   # Webhook trigger from Sanity
    types: [sanity-publish]

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: website/package-lock.json

      - run: npm ci
      - run: npm run build
        env:
          SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          SANITY_DATASET: ${{ secrets.SANITY_DATASET }}

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-2

      - name: Sync to S3
        run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete

      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

#### 2. GitHub Secrets

Add these secrets to the repo (Settings > Secrets and variables > Actions):

| Secret | Value |
|--------|-------|
| `SANITY_PROJECT_ID` | From Sanity dashboard |
| `SANITY_DATASET` | From Sanity dashboard |
| `AWS_ACCESS_KEY_ID` | From AWS IAM user with S3 + CloudFront access |
| `AWS_SECRET_ACCESS_KEY` | Corresponding secret key |
| `S3_BUCKET` | The S3 bucket name (e.g. `algosoc.com`) |
| `CLOUDFRONT_DISTRIBUTION_ID` | The CloudFront distribution ID |

#### 3. GitHub Personal Access Token

Create a fine-grained personal access token (Settings > Developer settings > Personal access tokens > Fine-grained tokens):

- **Repository access**: Select the AlgoSoc repo only
- **Permissions**: Contents (read), Actions (write)
- Copy the token for the next step

#### 4. Sanity Webhook

In the Sanity dashboard (manage.sanity.io > project > API > Webhooks), create a webhook:

| Field | Value |
|-------|-------|
| **Name** | Deploy Website |
| **URL** | `https://api.github.com/repos/YOUR_USERNAME/AlgoSoc/dispatches` |
| **HTTP method** | POST |
| **HTTP headers** | `Authorization: Bearer YOUR_GITHUB_TOKEN` |
| **HTTP headers** | `Accept: application/vnd.github.v3+json` |
| **Request body** | `{"event_type": "sanity-publish"}` |
| **Trigger on** | Create, Update, Delete |
| **Filter** | Leave blank (triggers on all content types) |
| **Dataset** | production |

#### 5. Usage Limits

GitHub Actions free tier for private repos: **2,000 minutes/month**. Each rebuild takes ~2 minutes, giving roughly **1,000 deploys/month**. Publishing content 30+ times per day, every day, would be needed to approach this limit.

### Manual Rebuild

Trigger a rebuild manually from the GitHub Actions tab, or via CLI:

```bash
gh workflow run deploy.yml
```

## Project Structure

```
website/
  public/               Static assets (images, docs, favicon)
  src/
    layouts/            BaseLayout.astro (HTML shell, branding, fonts)
    pages/              Astro pages (one per route)
    components/
      layout/           Header, Footer
      ui/               LiveChart, FadeIn
      content/          MemberCard, SponsorLogo
    lib/                Shared utilities (sanity client, categories, format, content, data)
    styles/             globals.css (Tailwind + brand tokens + custom CSS)
    sanity/schemas/     Sanity schema definitions (8 types)
  sanity.config.ts      Sanity Studio config
  sanity.cli.ts         Sanity CLI config
  astro.config.mjs      Astro config
  postcss.config.mjs    Tailwind/PostCSS config
```

## Client-Side JavaScript

All components are native Astro (`.astro` files) with no React. The site ships zero client-side JS frameworks. Interactive behaviour (mobile menu, chart animation) uses inline `<script>` tags.
