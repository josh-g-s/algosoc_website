import { defineType, defineField } from "sanity";

// Editable copy for the events page (`/events`). The event cards come from the
// `event` document type, not this document.
export default defineType({
  name: "eventsPage",
  title: "Events Page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "emptyState",
      title: "Empty State Message",
      description: "Shown when there are no upcoming events.",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Events Page" }),
  },
});
