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
  },
  vite: {
    css: {
      transformer: "postcss",
    },
  },
});
