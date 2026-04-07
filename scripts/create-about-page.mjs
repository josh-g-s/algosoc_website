// One-time script to create the About Page document in Sanity.
// Usage: SANITY_TOKEN=<token> node scripts/create-about-page.mjs

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
  _id: "aboutPage",
  _type: "aboutPage",
  mission:
    "We exist to bridge the gap between academic knowledge and industry practice. Through our educational programmes, flagship competitions, and student-managed quantitative fund, we give members the skills, experience, and connections they need to launch careers in quantitative finance.",
  pillars: [
    {
      _key: "educate",
      title: "Educate",
      description:
        "Bootcamp, AlgoCourse, Markets 101, and weekly quant sessions prepare members for careers and interviews in trading and quant research.",
    },
    {
      _key: "compete",
      title: "Compete",
      description:
        "Algothon, Estimathon, and our internal QTC competition give members hands-on trading experience in competitive settings.",
    },
    {
      _key: "invest",
      title: "Invest",
      description:
        "Queen's Tower Capital is our student-managed quantitative fund, where analysts build and execute real trading strategies across Market Making, Market Taking, and Options divisions.",
    },
    {
      _key: "connect",
      title: "Connect",
      description:
        "We partner with {partners} leading firms to bring industry insight, career opportunities, and mentorship to our members.",
    },
  ],
};

async function main() {
  const existing = await client.fetch(`*[_type == "aboutPage"][0]{ _id }`);

  if (existing) {
    console.log(`About page already exists (${existing._id}), updating...`);
    await client.createOrReplace({ ...doc, _id: existing._id });
  } else {
    console.log("Creating About page document...");
    await client.createOrReplace(doc);
  }

  console.log("Done! About page content created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
