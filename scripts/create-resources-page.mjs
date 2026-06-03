// One-time script to create the Resources Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-resources-page.mjs

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
  _id: "resourcesPage",
  _type: "resourcesPage",
  heading: "Resources",
  intro:
    "Lecture slides, problem sets, code notebooks, and career guides for AlgoSoc members.",
  emptyState: "No resources yet. Check back soon.",
};

async function main() {
  const existing = await client.fetch(`*[_type == "resourcesPage"][0]{ _id }`);

  if (existing) {
    console.log(`Resources page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Resources page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Resources page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
