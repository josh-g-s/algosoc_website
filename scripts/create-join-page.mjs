// One-time script to create the Join Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-join-page.mjs

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
  _id: "joinPage",
  _type: "joinPage",
  heading: "Join AlgoSoc",
  intro:
    "Become part of Imperial College's largest algorithmic trading and quantitative finance community. Membership gives you access to all our programmes, events, and resources.",
  ctaLabel: "Join via Imperial College Union",
  ctaUrl: "#",
  ctaNote: "Free for all Imperial College students.",
};

async function main() {
  const existing = await client.fetch(`*[_type == "joinPage"][0]{ _id }`);

  if (existing) {
    console.log(`Join page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Join page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Join page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
