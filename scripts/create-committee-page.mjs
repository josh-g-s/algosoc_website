// One-time script to create the Committee Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-committee-page.mjs

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
  _id: "committeePage",
  _type: "committeePage",
  heading: "Our Committees",
  intro: "The AlgoSoc & ICWiT committees driving our programmes, events, and partnerships.",
  algosocHeading: "AlgoSoc Leadership",
  algosocEmpty: "Committee members will be announced soon.",
  icwitHeading: "ICWiT Leadership",
  icwitEmpty: "ICWiT committee members will be announced soon.",
};

async function main() {
  const existing = await client.fetch(`*[_type == "committeePage"][0]{ _id }`);

  if (existing) {
    console.log(`Committee page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Committee page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Committee page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
