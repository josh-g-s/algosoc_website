import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { client } from "@/lib/sanity";
import { isPublished } from "@/lib/content";
import { toHTML } from "@portabletext/to-html";

export async function GET(context: APIContext) {
  const [posts, newsletters, recaps, events] = await Promise.all([
    client.fetch<Array<{
      title: string;
      slug: { current: string };
      publishDate?: string;
      expiryDate?: string;
      excerpt?: string;
    }>>(`*[_type == "post"]{ title, slug, publishDate, expiryDate, excerpt }`).catch(() => []),
    client.fetch<Array<{
      title: string;
      slug: { current: string };
      weekStart?: string;
      publishDate?: string;
      expiryDate?: string;
      excerpt?: string;
    }>>(`*[_type == "newsletter"]{ title, slug, weekStart, publishDate, expiryDate, excerpt }`).catch(() => []),
    client.fetch<Array<{
      title: string;
      slug: { current: string };
      weekStart?: string;
      publishDate?: string;
      expiryDate?: string;
      excerpt?: string;
    }>>(`*[_type == "marketRecap"]{ title, slug, weekStart, publishDate, expiryDate, excerpt }`).catch(() => []),
    client.fetch<Array<{
      title: string;
      date?: string;
      body?: any[];
      publishDate?: string;
      expiryDate?: string;
    }>>(`*[_type == "event"]{ title, date, body, publishDate, expiryDate }`).catch(() => []),
  ]);

  const postItems = posts
    .filter((p) => isPublished(p.publishDate, p.expiryDate))
    .map((p) => ({
      title: p.title,
      description: p.excerpt || "",
      pubDate: p.publishDate ? new Date(p.publishDate) : new Date(),
      link: `/news-and-research/${p.slug.current}`,
    }));

  const newsletterItems = newsletters
    .filter((n) => isPublished(n.publishDate, n.expiryDate))
    .map((n) => ({
      title: n.title,
      description: n.excerpt || "",
      pubDate: new Date(n.publishDate || n.weekStart || Date.now()),
      link: `/newsletter/${n.slug.current}`,
    }));

  const recapItems = recaps
    .filter((r) => isPublished(r.publishDate, r.expiryDate))
    .map((r) => ({
      title: r.title,
      description: r.excerpt || "",
      pubDate: new Date(r.publishDate || r.weekStart || Date.now()),
      link: `/market-recap/${r.slug.current}`,
    }));

  const eventItems = events
    .filter((e) => isPublished(e.publishDate, e.expiryDate, e.date))
    .map((e) => ({
      title: e.title,
      description: e.body ? toHTML(e.body).replace(/<[^>]+>/g, " ").trim() : "",
      pubDate: e.date ? new Date(e.date) : new Date(),
      link: "/events",
    }));

  const items = [...postItems, ...newsletterItems, ...recapItems, ...eventItems]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 50);

  return rss({
    title: "AlgoSoc - Imperial College Algorithmic Trading Society",
    description: "Blog posts, events, and updates from AlgoSoc.",
    site: context.site!,
    items,
  });
}
