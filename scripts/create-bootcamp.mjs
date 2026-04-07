// One-time script to create/update the Bootcamp programme document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-bootcamp.mjs

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
  _id: "programme-bootcamp",
  _type: "programme",
  title: "Bootcamp",
  slug: { _type: "slug", current: "bootcamp" },
  description:
    "A pre-requisite crash course for the AlgoCourse, covering foundational concepts for members new to quantitative trading. No prior experience required.",
  highlights: ["All Backgrounds Welcome", "Feeds into AlgoCourse", "Hands-on Coding"],
  stats: [],
  curriculum: [
    { _key: "t1", label: "01", title: "Market Microstructure", description: "Order books, price formation, and the economics of the bid-ask spread." },
    { _key: "t2", label: "02", title: "Python Fundamentals", description: "Core Python for working with financial data, libraries, and basic analysis." },
    { _key: "t3", label: "03", title: "Trading Concepts", description: "Introduction to algorithmic trading, strategy types, and key terminology." },
    { _key: "t4", label: "04", title: "Hands-on Exercises", description: "Practical coding exercises to reinforce concepts and prepare for AlgoCourse." },
  ],
  body: [
    {
      _type: "block",
      _key: "cta-heading",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "Ready for More?" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "cta-body",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s2",
          text: "Bootcamp is designed as a stepping stone into AlgoCourse, our intensive 8-week programme. Complete the Bootcamp and you'll have everything you need to hit the ground running.",
        },
      ],
      markDefs: [],
    },
  ],
  sortOrder: 2,
};

async function main() {
  const existing = await client.fetch(
    `*[_type == "programme" && slug.current == "bootcamp"][0]{ _id }`
  );

  if (existing) {
    console.log(`Programme already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Bootcamp programme...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Bootcamp programme created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
