// One-time script to create the Sponsors Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-sponsors-page.mjs

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
  _id: "sponsorsPage",
  _type: "sponsorsPage",
  heading: "Our Sponsors",
  intro:
    "AlgoSoc is proudly supported by leading firms in quantitative finance, algorithmic trading, and technology.",
  algosocHeading: "AlgoSoc Sponsors",
  icwitHeading: "ICWiT Sponsors (2025-26)",
  tierCopy: [
    {
      _key: "platinum",
      tier: "platinum",
      description:
        "Exclusive naming rights on a flagship event, priority CV book access, dedicated newsletter feature, and branded presence across all channels.",
      amount: "Top tier",
    },
    {
      _key: "gold",
      tier: "gold",
      description:
        "Logo on all key materials, two sponsored events, CV book access, and featured newsletter post.",
      amount: "Mid tier",
    },
    {
      _key: "silver",
      tier: "silver",
      description: "Logo on website and social media, one sponsored event, and newsletter mention.",
      amount: "Supporting tier",
    },
    {
      _key: "bronze",
      tier: "bronze",
      description: "Logo on website and event programmes.",
      amount: "Entry tier",
    },
    {
      _key: "icwit-alpha",
      tier: "icwit-alpha",
      description:
        "Exclusive naming rights, priority CV book access, dedicated newsletter features, and branded presence across all channels.",
      amount: "2025-26",
    },
    {
      _key: "icwit-beta",
      tier: "icwit-beta",
      description: "Logo on all key materials, sponsored events, CV book access, and featured newsletter posts.",
      amount: "2025-26",
    },
    {
      _key: "icwit-gamma",
      tier: "icwit-gamma",
      description: "Logo on website and social media, sponsored event, and newsletter mention.",
      amount: "2025-26",
    },
  ],
  ctaHeading: "Interested in Sponsoring AlgoSoc?",
  ctaIntro:
    "Partner with London's largest university algorithmic trading society. Reach 1,000+ ambitious students in STEM.",
  ctaLabel: "Get in Touch",
  ctaUrl: "mailto:algo.trade@imperial.ac.uk",
};

async function main() {
  const existing = await client.fetch(`*[_type == "sponsorsPage"][0]{ _id }`);

  if (existing) {
    console.log(`Sponsors page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Sponsors page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Sponsors page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
