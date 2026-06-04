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

// One bullet block per QTE arm. Sub-descriptions are derived from QTE's
// published role list (queenstowerexchange.com): market makers, takers,
// hedge-fund researchers, execution specialists, hardware engineers,
// technologists, and AI developers.
const arms = [
  ["a1", "Market Making - inventory risk, spread quoting, hedging"],
  ["a2", "Market Taking - signal research, backtesting, execution"],
  ["a3", "Options - volatility trading, Greeks management, options strategies"],
  ["a4", "Fundamentals - hedge-fund-style research and valuation"],
  ["a5", "Execution - optimal execution and slippage minimisation"],
  ["a6", "FPGA - low-latency hardware engineering"],
  ["a7", "Technology - exchange and trading infrastructure"],
  ["a8", "Agentic AI - autonomous trading agents"],
];

const doc = {
  _type: "programme",
  title: "Queen's Tower Exchange",
  slug: { _type: "slug", current: "queens-tower-exchange" },
  description:
    "AlgoSoc's flagship live-market exchange simulation. Student teams trade across equities, FX, commodities, fixed income, and options on real L2 order-book data, competing simultaneously across eight specialised arms.",
  highlights: ["8 Arms, One Exchange", "Live Market Simulation", "Real L2 Data"],
  stats: [
    { _key: "arms", value: "8", label: "Arms" },
    { _key: "assets", value: "5", label: "Asset Classes" },
  ],
  body: [
    {
      _type: "block",
      _key: "intro",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "intro-s",
          text:
            "QTE runs as a single connected exchange where student teams take on distinct roles and compete across asset classes at the same time. The eight arms:",
          marks: [],
        },
      ],
    },
    ...arms.map(([key, text]) => ({
      _type: "block",
      _key: key,
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
    })),
    {
      _type: "block",
      _key: "outro",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "outro-s",
          text: "Performance is tracked across the exchange with live rankings and internal competition.",
          marks: [],
        },
      ],
    },
  ],
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
