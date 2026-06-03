// One-time script to create the WiT Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-wit-page.mjs

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
  _id: "witPage",
  _type: "witPage",
  heading: "Imperial College Women in Trading",
  intro:
    "ICWiT is a sub-society within AlgoSoc dedicated to empowering women in quantitative finance, trading, and technology. With {members} members and {events} events, we provide a supportive community, mentorship, and career opportunities.",
  instagramUrl: "https://www.instagram.com/ic.wit/",
  instagramHandle: "@ic.wit",
  eventsHeading: "Our Events",
  leadershipHeading: "ICWiT Leadership",
  leadershipEmpty: "ICWiT committee members will be announced soon.",
};

async function main() {
  const existing = await client.fetch(`*[_type == "witPage"][0]{ _id }`);

  if (existing) {
    console.log(`WiT page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating WiT page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! WiT page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
