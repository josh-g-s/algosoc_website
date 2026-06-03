// One-time script to create the News & Research Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-news-page.mjs

import "dotenv/config";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "bd3zp068",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

if (!process.env.SANITY_TOKEN) {
  console.error("Set SANITY_TOKEN env var (create one at sanity.io/manage -> API -> Tokens)");
  process.exit(1);
}

const doc = {
  _id: "newsPage",
  _type: "newsPage",
  heading: "News & Research",
  intro:
    "Weekly market recaps, newsletter issues, research notes, and announcements from the AlgoSoc committee.",
  emptyState: "No posts yet. Check back soon.",
};

async function main() {
  const existing = await client.fetch(`*[_type == "newsPage"][0]{ _id }`);

  if (existing) {
    console.log(`News page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating News page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! News & Research page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
