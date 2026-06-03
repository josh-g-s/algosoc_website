import { defineType, defineField } from "sanity";

// Editable copy for the home page (`/`). Dynamic data (events, programmes,
// sponsors, key statistics, the live chart) is not stored here; it is fetched
// from its own document types and computed stats.
export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fieldsets: [
    { name: "hero", title: "Hero" },
    { name: "programmes", title: "Programmes Section" },
    { name: "events", title: "Events Section" },
    { name: "sponsors", title: "Sponsors Section" },
    { name: "newsletter", title: "Newsletter Section" },
  ],
  fields: [
    defineField({
      name: "heroHeadingLead",
      title: "Hero Heading",
      description: "Plain text shown before the accent-coloured phrase.",
      type: "string",
      fieldset: "hero",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroHeadingHighlight",
      title: "Hero Heading Highlight",
      description: "Accent-coloured phrase at the end of the heading (e.g. 'Aspiring Traders').",
      type: "string",
      fieldset: "hero",
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
      rows: 3,
      fieldset: "hero",
      validation: (r) => r.required(),
    }),
    defineField({ name: "heroPrimaryCtaLabel", title: "Primary Button Label", type: "string", fieldset: "hero" }),
    defineField({ name: "heroPrimaryCtaUrl", title: "Primary Button URL", type: "string", fieldset: "hero" }),
    defineField({ name: "heroSecondaryCtaLabel", title: "Secondary Button Label", type: "string", fieldset: "hero" }),
    defineField({ name: "heroSecondaryCtaUrl", title: "Secondary Button URL", type: "string", fieldset: "hero" }),

    defineField({ name: "programmesHeading", title: "Heading", type: "string", fieldset: "programmes" }),
    defineField({ name: "programmesIntro", title: "Intro", type: "text", rows: 2, fieldset: "programmes" }),

    defineField({ name: "eventsHeading", title: "Heading", type: "string", fieldset: "events" }),
    defineField({ name: "eventsIntro", title: "Intro", type: "text", rows: 2, fieldset: "events" }),

    defineField({ name: "sponsorsHeading", title: "Heading", type: "string", fieldset: "sponsors" }),
    defineField({ name: "sponsorsIntro", title: "Intro", type: "text", rows: 2, fieldset: "sponsors" }),

    defineField({ name: "newsletterHeading", title: "Heading", type: "string", fieldset: "newsletter" }),
    defineField({ name: "newsletterIntro", title: "Intro", type: "text", rows: 2, fieldset: "newsletter" }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
