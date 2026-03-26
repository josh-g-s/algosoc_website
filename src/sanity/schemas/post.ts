import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Newsletter", value: "newsletter" },
          { title: "Market Recap", value: "market-recap" },
          { title: "Research", value: "research" },
          { title: "Announcement", value: "announcement" },
        ],
      },
      initialValue: "newsletter",
    }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "publishDate", title: "Publish Date", type: "date" }),
    defineField({ name: "expiryDate", title: "Expiry Date", type: "date" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "featuredImage", title: "Featured Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "content", title: "Content", type: "array", of: [{ type: "block" }, { type: "image" }] }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "featuredImage" },
  },
});
