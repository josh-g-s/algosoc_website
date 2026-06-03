import { defineType, defineField } from "sanity";

// Tier values must match the `tier` field on the `sponsor` schema. Tier order,
// display names, and grouping are fixed in code (sponsors.astro); editors only
// supply the description + amount text per tier, looked up by this value.
const TIER_OPTIONS = [
  { title: "Platinum (AlgoSoc)", value: "platinum" },
  { title: "Gold (AlgoSoc)", value: "gold" },
  { title: "Silver (AlgoSoc)", value: "silver" },
  { title: "Bronze (AlgoSoc)", value: "bronze" },
  { title: "Alpha (ICWiT)", value: "icwit-alpha" },
  { title: "Beta (ICWiT)", value: "icwit-beta" },
  { title: "Gamma (ICWiT)", value: "icwit-gamma" },
];

// Editable copy for the sponsors page (`/sponsors`). Sponsor logos and their
// tier assignments come from the `sponsor` document type, not this document.
export default defineType({
  name: "sponsorsPage",
  title: "Sponsors Page",
  type: "document",
  fieldsets: [
    { name: "header", title: "Header" },
    { name: "groups", title: "Group Headings" },
    { name: "cta", title: "Call to Action" },
  ],
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      fieldset: "header",
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3, fieldset: "header" }),

    defineField({ name: "algosocHeading", title: "AlgoSoc Sponsors Heading", type: "string", fieldset: "groups" }),
    defineField({ name: "icwitHeading", title: "ICWiT Sponsors Heading", type: "string", fieldset: "groups" }),

    defineField({
      name: "tierCopy",
      title: "Tier Descriptions",
      description:
        "Description and amount tag per tier. Tiers omitted here fall back to the built-in copy. Tier order and names are fixed in code.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "tier",
              title: "Tier",
              type: "string",
              options: { list: TIER_OPTIONS },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (r) => r.required(),
            }),
            defineField({
              name: "amount",
              title: "Amount Tag",
              description: "Short label, e.g. 'Top tier'.",
              type: "string",
            }),
          ],
          preview: { select: { title: "tier", subtitle: "amount" } },
        },
      ],
    }),

    defineField({ name: "ctaHeading", title: "Heading", type: "string", fieldset: "cta" }),
    defineField({ name: "ctaIntro", title: "Intro", type: "text", rows: 2, fieldset: "cta" }),
    defineField({ name: "ctaLabel", title: "Button Label", type: "string", fieldset: "cta" }),
    defineField({ name: "ctaUrl", title: "Button URL", type: "string", fieldset: "cta" }),
  ],
  preview: {
    prepare: () => ({ title: "Sponsors Page" }),
  },
});
