import { client } from "@/lib/sanity";

const FALLBACK_EMAIL = "algo.trade@imperial.ac.uk";

/**
 * The society inbox from Sanity siteConfig. Only a plain address is trusted (a pasted
 * "mailto:" prefix is stripped); anything else, such as a query string, uses the fallback.
 */
export async function getContactEmail(): Promise<string> {
  const config = await client
    .fetch<{ contactEmail?: string } | null>(`*[_type == "siteConfig"][0]{ contactEmail }`)
    .catch(() => null);
  const configured =
    config && !Array.isArray(config) ? config.contactEmail?.trim().replace(/^mailto:/i, "") : undefined;
  return configured && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(configured)
    ? configured
    : FALLBACK_EMAIL;
}
