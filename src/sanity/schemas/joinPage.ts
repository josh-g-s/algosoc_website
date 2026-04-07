import { defineType, defineField } from "sanity";

export default defineType({
  name: "joinPage",
  title: "Join Page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Join ICATS",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro Text",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "Join via Imperial College Union",
    }),
    defineField({
      name: "ctaUrl",
      title: "CTA Button URL",
      type: "url",
      validation: (r) => r.uri({ allowRelative: true }),
    }),
    defineField({
      name: "ctaNote",
      title: "CTA Note",
      description: "Small text below the button (e.g. 'Free for all Imperial College students.')",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Join Page" }),
  },
});
