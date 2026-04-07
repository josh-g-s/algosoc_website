// One-time script to create the Markets 101 programme document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-markets-101.mjs

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
  _id: "programme-markets-101",
  _type: "programme",
  title: "Markets 101",
  slug: { _type: "slug", current: "markets-101" },
  description:
    "Weekly student-led lectures on financial markets, delivered by Imperial students with internship experience at top hedge funds and banks. No prior knowledge required.",
  highlights: ["Weekly", "Student-led", "All Levels Welcome"],
  stats: [
    { _key: "freq", value: "Weekly", label: "Frequency" },
    { _key: "day", value: "Thursdays", label: "Schedule" },
  ],
  body: [
    {
      _type: "block",
      _key: "intro",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "What is Markets 101?" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "p1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s2",
          text: "Markets 101 is our flagship weekly lecture series, open to all Imperial students regardless of background or experience. Each session covers a different topic in financial markets, from the basics of equities and fixed income to more advanced areas like derivatives, market microstructure, and quantitative strategies.",
        },
      ],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "h2",
      style: "h2",
      children: [{ _type: "span", _key: "s3", text: "Who teaches?" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "p2",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s4",
          text: "Every lecture is delivered by a fellow Imperial student who has completed an internship at a leading hedge fund, bank, or trading firm. This means you get real-world insight from people who have been in the seat, not just textbook theory.",
        },
      ],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "h3",
      style: "h2",
      children: [{ _type: "span", _key: "s5", text: "What to expect" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "l1",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [{ _type: "span", _key: "s6", text: "Accessible, jargon-free introductions to key market concepts" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "l2",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [{ _type: "span", _key: "s7", text: "Practical examples drawn from real trading desks" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "l3",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [{ _type: "span", _key: "s8", text: "Q&A with speakers after every session" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "l4",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [{ _type: "span", _key: "s9", text: "A great starting point before diving into AlgoCourse or Queen's Tower Capital" }],
      markDefs: [],
    },
  ],
  sortOrder: 3,
};

async function main() {
  const existing = await client.fetch(
    `*[_type == "programme" && slug.current == "markets-101"][0]{ _id }`
  );

  if (existing) {
    console.log(`Programme already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Markets 101 programme...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Markets 101 programme created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
