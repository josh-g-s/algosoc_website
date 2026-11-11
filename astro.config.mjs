// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://algosoc.com",
  output: "static",
  // Astro 7 defaults to "jsx", which drops the space between text and inline elements.
  compressHTML: true,
  integrations: [
    sitemap({
      // Redirect stubs, not real pages.
      filter: (page) =>
        !page.includes("/programmes/queens-tower-capital") &&
        !/\/blog\/?$/.test(page),
    }),
  ],
  redirects: {
    "/blog": "/news-and-research",
    "/blog/[slug]": "/news-and-research/[slug]",
    // Queen's Tower Capital was rebranded to Queen's Tower Exchange (QTC -> QTE).
    "/programmes/queens-tower-capital": "/programmes/queens-tower-exchange",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
