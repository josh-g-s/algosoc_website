// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://algosoc.com",
  output: "static",
  integrations: [sitemap()],
  redirects: {
    "/blog": "/news-and-research",
    "/blog/[slug]": "/news-and-research/[slug]",
    // Queen's Tower Capital was rebranded to Queen's Tower Exchange (QTC -> QTE).
    "/programmes/queens-tower-capital": "/programmes/queens-tower-exchange",
  },
  vite: {
    css: {
      transformer: "postcss",
    },
  },
});
