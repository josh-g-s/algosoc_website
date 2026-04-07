// One-time script to create the Weekly Quant Sessions programme document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-weekly-quant-sessions.mjs

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
  _id: "programme-weekly-quant-sessions",
  _type: "programme",
  title: "Weekly Quant Sessions",
  slug: { _type: "slug", current: "weekly-quant-sessions" },
  description:
    "Weekly collaborative sessions where members tackle quantitative finance problems, explore new strategies, and sharpen their analytical skills together.",
  highlights: ["Weekly", "Collaborative", "All Levels"],
  stats: [
    { _key: "freq", value: "Weekly", label: "Frequency" },
  ],
  body: [
    {
      _type: "block",
      _key: "h1",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "What are Weekly Quant Sessions?" }],
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
          text: "Weekly Quant Sessions are informal, collaborative meetups where ICATS members work through quantitative finance problems together. Each session focuses on a different topic, from brainteasers and probability puzzles to real-world strategy development and data analysis.",
        },
      ],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "h2",
      style: "h2",
      children: [{ _type: "span", _key: "s3", text: "What to expect" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "l1",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [{ _type: "span", _key: "s4", text: "Hands-on problem-solving in small groups" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "l2",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [{ _type: "span", _key: "s5", text: "Topics spanning probability, statistics, and quantitative strategy" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "l3",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [{ _type: "span", _key: "s6", text: "A relaxed environment to learn from peers and build intuition" }],
      markDefs: [],
    },
    {
      _type: "block",
      _key: "l4",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [{ _type: "span", _key: "s7", text: "Great preparation for quant interviews and trading challenges" }],
      markDefs: [],
    },
  ],
  sortOrder: 4,
};

async function main() {
  const existing = await client.fetch(
    `*[_type == "programme" && slug.current == "weekly-quant-sessions"][0]{ _id }`
  );

  if (existing) {
    console.log(`Programme already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Weekly Quant Sessions programme...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Weekly Quant Sessions programme created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
