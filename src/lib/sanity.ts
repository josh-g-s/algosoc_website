import { createClient, type SanityClient } from "@sanity/client";

const projectId = import.meta.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;

function buildClient(): SanityClient {
  if (!projectId) {
    // Return a stub client that always returns empty arrays for queries.
    // This allows the site to build without Sanity configured.
    return {
      fetch: () => Promise.resolve([]),
      config: () => ({}),
    } as unknown as SanityClient;
  }

  return createClient({
    projectId,
    dataset: import.meta.env.SANITY_DATASET || "production",
    apiVersion: "2026-03-24",
    useCdn: true,
  });
}

export const client = buildClient();
