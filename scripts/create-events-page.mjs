// One-time script to create the Events Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-events-page.mjs

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
  _id: "eventsPage",
  _type: "eventsPage",
  heading: "Events",
  intro: "Competitions, workshops, lectures, and socials throughout the academic year.",
  emptyState: "No upcoming events. Check back soon.",
};

async function main() {
  const existing = await client.fetch(`*[_type == "eventsPage"][0]{ _id }`);

  if (existing) {
    console.log(`Events page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Events page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Events page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
