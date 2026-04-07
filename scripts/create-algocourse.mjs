// One-time script to create/update the AlgoCourse programme document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-algocourse.mjs

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
  _id: "programme-algocourse",
  _type: "programme",
  title: "AlgoCourse",
  slug: { _type: "slug", current: "algocourse" },
  description:
    "An intensive 8-week comprehensive course covering all fundamentals needed for a successful career in financial markets. Taught by fellow Imperial students with industry internship experience, covering everything from Python basics to advanced trading strategies.",
  highlights: ["8 Weeks", "Python to Strategies", "Taught by Students"],
  stats: [
    { _key: "weeks", value: "8", label: "Weeks" },
    { _key: "attendees", value: "520+", label: "Past Attendees" },
    { _key: "lectures", value: "7", label: "Lectures" },
  ],
  curriculum: [
    { _key: "w1", label: "Week 1", title: "Python Fundamentals", description: "Core Python for finance: data types, control flow, functions, and libraries." },
    { _key: "w2", label: "Week 2", title: "Data Analysis", description: "NumPy, pandas, and data wrangling for financial datasets." },
    { _key: "w3", label: "Week 3", title: "Market Microstructure", description: "Order books, price formation, and the economics of the bid-ask spread." },
    { _key: "w4", label: "Week 4", title: "Statistical Foundations", description: "Probability, distributions, hypothesis testing, and time series analysis." },
    { _key: "w5", label: "Week 5", title: "Signal Generation", description: "Alpha research, factor models, and building trading signals from data." },
    { _key: "w6", label: "Week 6", title: "Backtesting", description: "Strategy evaluation, avoiding overfitting, and performance metrics." },
    { _key: "w7", label: "Week 7", title: "Options & Derivatives", description: "Options pricing, Greeks, volatility surfaces, and basic strategies." },
    { _key: "w8", label: "Week 8", title: "Execution & ML", description: "Execution algorithms, slippage, and machine learning applications in trading." },
  ],
  sortOrder: 1,
};

async function main() {
  const existing = await client.fetch(
    `*[_type == "programme" && slug.current == "algocourse"][0]{ _id }`
  );

  if (existing) {
    console.log(`Programme already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating AlgoCourse programme...");
    await client.createOrReplace(doc);
  }

  console.log("Done! AlgoCourse programme created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
