/**
 * Shared content helpers.
 */

import { client } from "@/lib/sanity";

/** Today's date as an ISO date string (YYYY-MM-DD). */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Returns true when a piece of content should be visible today.
 *
 * - Hidden if `publishDate` is in the future.
 * - Hidden if `expiryDate` (or the optional `fallbackExpiry`) is in the past.
 */
export function isPublished(
  publishDate?: string | null,
  expiryDate?: string | null,
  fallbackExpiry?: string | null,
): boolean {
  const now = todayISO();
  if (publishDate && publishDate > now) return false;
  const expiry = expiryDate || fallbackExpiry;
  if (expiry && expiry < now) return false;
  return true;
}

export type Stats = {
  members: string;
  founded: string;
  eventsHosted: string;
  offers: string;
  partners: string;
  witMembers: string;
  witEvents: string;
};

/**
 * Read site-wide stats from Sanity.
 * "partners" and "eventsHosted" are derived from Sanity document counts.
 */
export async function getStats(): Promise<Stats> {
  const [siteConfig, sponsorCount, eventCount, witEventCount] = await Promise.all([
    client.fetch<{
      stats?: {
        members?: string;
        founded?: string;
        offers?: string;
        witMembers?: string;
      };
    }>(`*[_type == "siteConfig"][0]`),
    client.fetch<number>(`count(*[_type == "sponsor"])`),
    client.fetch<number>(`count(*[_type == "event"])`),
    client.fetch<number>(`count(*[_type == "event" && category == "icwit"])`),
  ]);

  const s = siteConfig?.stats;
  return {
    members: s?.members || "",
    founded: s?.founded || "",
    eventsHosted: eventCount > 0 ? `${eventCount}` : "",
    offers: s?.offers || "",
    partners: sponsorCount > 0 ? `${sponsorCount}` : "",
    witMembers: s?.witMembers || "",
    witEvents: witEventCount > 0 ? `${witEventCount}` : "",
  };
}
