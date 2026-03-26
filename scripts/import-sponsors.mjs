// NOTE: This script was a one-time import from the legacy Next.js site.
// The source directories (demo/content/sponsors, demo/public/img/sponsors) no longer exist.
// Kept as a reference for future Sanity import scripts.

import "dotenv/config";
import { createClient } from "@sanity/client";
import { readFileSync, readdirSync, createReadStream } from "fs";
import { join, basename, extname } from "path";

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

const SPONSORS_DIR = join(import.meta.dirname, "../../demo/content/sponsors");
const LOGOS_DIR = join(import.meta.dirname, "../../demo/public/img/sponsors");

// Map logo paths from YAML to actual filenames
const logoMap = {
  "/img/sponsors/IMC.png": "IMC.png",
  "/img/sponsors/BrevanHoward.png": "BrevanHoward.png",
  "/img/sponsors/Citadel.jpg": "Citadel.jpg",
  "/img/sponsors/DaVinci.png": "DaVinci.png",
  "/img/sponsors/fiverings.svg": "fiverings.svg",
  "/img/sponsors/FlowTraders.png": "FlowTraders.png",
  "/img/sponsors/HRTlogo.png": "HRTlogo.png",
  "/img/sponsors/JaneStreet.png": "JaneStreet.png",
  "/img/sponsors/JPM.svg": "JPM.svg",
  "/img/sponsors/MWLogo.png": "MWLogo.png",
  "/img/sponsors/oldmission.svg": "oldmission.svg",
  "/img/sponsors/Optiver.png": "Optiver.png",
  "/img/sponsors/qrt_new_logo.svg": "qrt_new_logo.svg",
  "/img/sponsors/Rokos.png": "Rokos.png",
  "/img/sponsors/Susquehanna.svg": "Susquehanna.svg",
  "/img/sponsors/Wintermute.svg": "Wintermute.svg",
};

// Simple YAML parser for these flat files
function parseYaml(text) {
  const result = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      let val = match[2].trim();
      if (val === "''") val = "";
      result[match[1]] = val;
    }
  }
  return result;
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function uploadImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const contentTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
  };
  const contentType = contentTypes[ext] || "application/octet-stream";

  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename: basename(filePath),
    contentType,
  });
  return asset;
}

async function main() {
  const files = readdirSync(SPONSORS_DIR).filter((f) => f.endsWith(".yaml"));
  console.log(`Found ${files.length} sponsors to import\n`);

  for (const file of files) {
    const yaml = readFileSync(join(SPONSORS_DIR, file), "utf-8");
    const data = parseYaml(yaml);
    const slug = slugify(data.name);

    console.log(`Importing: ${data.name} (${data.tier})`);

    // Upload logo
    let logoRef = undefined;
    const logoFile = logoMap[data.logo];
    if (logoFile) {
      const logoPath = join(LOGOS_DIR, logoFile);
      try {
        const asset = await uploadImage(logoPath);
        logoRef = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
        console.log(`  Logo uploaded: ${logoFile}`);
      } catch (err) {
        console.error(`  Failed to upload logo: ${err.message}`);
      }
    }

    const doc = {
      _type: "sponsor",
      name: data.name,
      slug: { _type: "slug", current: slug },
      tier: data.tier,
      websiteUrl: data.websiteUrl || undefined,
      description: data.description || undefined,
      ...(logoRef && { logo: logoRef }),
    };

    await client.createOrReplace({ ...doc, _id: `sponsor-${slug}` });
    console.log(`  Created: sponsor-${slug}\n`);
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
