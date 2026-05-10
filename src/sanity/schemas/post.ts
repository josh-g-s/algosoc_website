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
          { title: "Research", value: "research" },
          { title: "Announcement", value: "announcement" },
        ],
      },
      initialValue: "announcement",
      description: "Newsletters and market recaps live in their own document types.",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "teamMember" }],
    }),
    defineField({ name: "publishDate", title: "Publish Date", type: "date" }),
    defineField({ name: "expiryDate", title: "Expiry Date", type: "date" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
      validation: (r) => r.min(1),
    }),
    defineField({ name: "featuredImage", title: "Featured Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description: "Optional. Falls back to Featured Image when empty.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "Optional SEO description. Falls back to Excerpt when empty.",
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "featuredImage" },
  },
});
