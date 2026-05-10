import { defineType, defineField } from "sanity";

export default defineType({
  name: "newsletter",
  title: "Newsletter Issue",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "issueNumber",
      title: "Issue Number",
      type: "number",
      validation: (r) => r.min(1).integer(),
    }),
    defineField({ name: "weekStart", title: "Week Start", type: "date", validation: (r) => r.required() }),
    defineField({ name: "weekEnd", title: "Week End", type: "date", validation: (r) => r.required() }),
    defineField({
      name: "editor",
      title: "Editor",
      type: "reference",
      to: [{ type: "teamMember" }],
    }),
    defineField({
      name: "coAuthors",
      title: "Co-authors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
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
      name: "intro",
      title: "Intro",
      type: "array",
      of: [{ type: "block" }],
      description: "Short editor's note that appears above the sections.",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
            }),
          ],
          preview: { select: { title: "heading" } },
        },
      ],
    }),
    defineField({
      name: "featuredLinks",
      title: "Featured Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "link",
          title: "Link",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", title: "URL", type: "url", validation: (r) => r.required() }),
            defineField({ name: "source", title: "Source", type: "string", description: "e.g. Bloomberg, FT" }),
            defineField({ name: "blurb", title: "Blurb", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title", subtitle: "source" },
          },
        },
      ],
    }),
    defineField({
      name: "featuredEvents",
      title: "Featured Events",
      type: "array",
      of: [{ type: "reference", to: [{ type: "event" }] }],
      description: "Upcoming events to highlight in this issue.",
    }),
  ],
  orderings: [
    { title: "Issue (newest first)", name: "issueDesc", by: [{ field: "issueNumber", direction: "desc" }] },
    { title: "Week start (newest first)", name: "weekStartDesc", by: [{ field: "weekStart", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", issue: "issueNumber", weekStart: "weekStart", media: "featuredImage" },
    prepare({ title, issue, weekStart, media }) {
      const issueLabel = issue ? `Issue #${issue}` : "";
      const subtitle = [issueLabel, weekStart].filter(Boolean).join(" · ");
      return { title, subtitle, media };
    },
  },
});
