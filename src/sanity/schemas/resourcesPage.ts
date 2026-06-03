import { defineType, defineField } from "sanity";

// Editable copy for the resources page (`/resources`). The resource cards
// themselves come from the `resource` document type, not this document.
export default defineType({
  name: "resourcesPage",
  title: "Resources Page",
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
      description: "Shown when there are no resources to display.",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Resources Page" }),
  },
});
