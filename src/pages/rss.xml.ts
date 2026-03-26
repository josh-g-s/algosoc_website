import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { client } from "@/lib/sanity";
import { isPublished } from "@/lib/content";
import { toHTML } from "@portabletext/to-html";

export async function GET(context: APIContext) {
  const [posts, events] = await Promise.all([
    client.fetch<Array<{
      title: string;
      slug: { current: string };
      publishDate?: string;
      expiryDate?: string;
      excerpt?: string;
    }>>(`*[_type == "post"]{ title, slug, publishDate, expiryDate, excerpt }`).catch(() => []),
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
      link: `/blog/${p.slug.current}`,
    }));

  const eventItems = events
    .filter((e) => isPublished(e.publishDate, e.expiryDate, e.date))
    .map((e) => ({
      title: e.title,
      description: e.body ? toHTML(e.body).replace(/<[^>]+>/g, " ").trim() : "",
      pubDate: e.date ? new Date(e.date) : new Date(),
      link: "/events",
    }));

  const items = [...postItems, ...eventItems]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 50);

  return rss({
    title: "ICATS - Imperial College Algorithmic Trading Society",
    description: "Blog posts, events, and updates from ICATS.",
    site: context.site!,
    items,
  });
}
