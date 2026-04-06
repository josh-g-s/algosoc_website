import { defineType, defineField } from "sanity";

export default defineType({
  name: "algothon",
  title: "Algothon",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (r) => r.required().integer().min(2018).max(2100),
    }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({
      name: "participants",
      title: "Participants",
      type: "number",
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: "recap",
      title: "Recap",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "images",
      title: "Image Carousel",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "sponsors",
      title: "Sponsors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "sponsorAlgothon" }] }],
    }),
  ],
  orderings: [
    {
      title: "Year (newest first)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? String(subtitle) : "" };
    },
  },
});
