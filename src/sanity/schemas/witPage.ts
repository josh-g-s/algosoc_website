import { defineType, defineField } from "sanity";

// Editable copy for the ICWiT page (`/wit`). The recurring event types come
// from `witEvent`, the leadership grid from `teamMember` (division "icwit"),
// and the headline stats are computed. The intro supports the tokens
// `{members}` and `{events}`, replaced with the live ICWiT stats.
export default defineType({
  name: "witPage",
  title: "WiT Page",
  type: "document",
  fieldsets: [
    { name: "header", title: "Header" },
    { name: "sections", title: "Section Headings" },
  ],
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      fieldset: "header",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      description: "Use {members} and {events} to insert the live ICWiT member and event counts.",
      type: "text",
      rows: 4,
      fieldset: "header",
    }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url", fieldset: "header" }),
    defineField({ name: "instagramHandle", title: "Instagram Handle", type: "string", fieldset: "header" }),

    defineField({ name: "eventsHeading", title: "Events Heading", type: "string", fieldset: "sections" }),
    defineField({ name: "leadershipHeading", title: "Leadership Heading", type: "string", fieldset: "sections" }),
    defineField({
      name: "leadershipEmpty",
      title: "Leadership Empty State",
      description: "Shown when there are no ICWiT committee members.",
      type: "string",
      fieldset: "sections",
    }),
  ],
  preview: {
    prepare: () => ({ title: "WiT Page" }),
  },
});
