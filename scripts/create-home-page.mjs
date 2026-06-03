// One-time script to create the Home Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-home-page.mjs

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
  _id: "homePage",
  _type: "homePage",
  heroHeadingLead: "Imperial College's Premier Society for",
  heroHeadingHighlight: "Aspiring Traders",
  heroSubheading:
    "Building the next generation of quantitative traders, researchers, and technologists through education, competitions, and real-world experience.",
  heroPrimaryCtaLabel: "Join AlgoSoc",
  heroPrimaryCtaUrl: "/join",
  heroSecondaryCtaLabel: "Explore Programmes",
  heroSecondaryCtaUrl: "/programmes",
  programmesHeading: "Our Programmes",
  programmesIntro:
    "From introductory courses to competitive trading, we offer something for every level of experience.",
  eventsHeading: "Upcoming Events",
  eventsIntro: "What's coming up this term.",
  sponsorsHeading: "Our Partners",
  sponsorsIntro: "Supported by leading firms in quantitative finance and trading.",
  newsletterHeading: "Stay in the Loop",
  newsletterIntro:
    "Get weekly market recaps, event updates, and quant insights straight to your inbox.",
};

async function main() {
  const existing = await client.fetch(`*[_type == "homePage"][0]{ _id }`);

  if (existing) {
    console.log(`Home page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating Home page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! Home page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
