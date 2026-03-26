// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://algosoc.com",
  output: "static",
  integrations: [sitemap()],
  vite: {
    css: {
      transformer: "postcss",
    },
  },
});
