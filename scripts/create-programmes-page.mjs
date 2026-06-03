// One-time script to create the Programmes and Algothon page documents.
// Usage: SANITY_TOKEN=<token> node scripts/create-programmes-page.mjs

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

const docs = [
  {
    _id: "programmesPage",
    _type: "programmesPage",
    heading: "Programmes",
    intro: "Educational initiatives, competitions, and hands-on trading experience for every level.",
    emptyState: "Programmes will be announced soon.",
  },
  {
    _id: "algothonPage",
    _type: "algothonPage",
    heading: "Algothon",
    intro:
      "Our flagship annual London inter-university hackathon where students compete in algorithmic trading challenges. Teams build and submit trading strategies against a live or historical dataset, judged on risk-adjusted returns.",
    emptyState: "Details for upcoming Algothon editions will be announced soon.",
  },
];

async function main() {
  for (const doc of docs) {
    const existing = await client.fetch(`*[_type == $type][0]{ _id }`, { type: doc._type });
    if (existing) {
      console.log(`${doc._type} already exists (${existing._id}), updating...`);
      await client.createOrReplace({ ...doc, _id: existing._id });
    } else {
      console.log(`Creating ${doc._type} document...`);
      await client.createOrReplace(doc);
    }
  }
  console.log("Done! Programmes and Algothon page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
