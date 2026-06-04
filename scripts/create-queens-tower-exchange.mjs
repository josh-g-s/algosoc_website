// One-time script to create/update the Queen's Tower Exchange programme in Sanity.
// Rebrand of the former "Queen's Tower Capital" (QTC) fund into the QTE
// live-market exchange simulation. Idempotent: finds the existing doc by the
// old or new slug and updates it in place.
// Usage: SANITY_TOKEN=<token> node scripts/create-queens-tower-exchange.mjs

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

// The QTE page is intentionally minimal: a one-line blurb plus a prominent
// button out to the dedicated QTE site, where the full detail lives.
const doc = {
  _type: "programme",
  title: "Queen's Tower Exchange",
  slug: { _type: "slug", current: "queens-tower-exchange" },
  description: "A closed exchange where Imperial students trade.",
  externalUrl: "https://queenstowerexchange.com",
  externalUrlLabel: "Press to learn more",
  sortOrder: 2,
};

async function main() {
  // Find the existing programme under either the new or old slug so re-runs
  // and the rename are both handled in place.
  const existing = await client.fetch(
    `*[_type == "programme" && (slug.current == "queens-tower-exchange" || slug.current == "queens-tower-capital")][0]{ _id }`
  );

  if (existing) {
    console.log(`Programme already exists (${existing._id}), updating to Queen's Tower Exchange...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Queen's Tower Exchange programme...");
    await client.createOrReplace({ ...doc, _id: "programme-queens-tower-exchange" });
  }

  console.log("Done! Queen's Tower Exchange programme written to Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
