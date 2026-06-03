import { defineType, defineField } from "sanity";

// Editable copy for the programmes index page (`/programmes`). The programme
// cards come from the `programme` document type. Each programme's own subpage
// is rendered from its `programme` (or `algothon`) document.
export default defineType({
  name: "programmesPage",
  title: "Programmes Page",
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
      description: "Shown when there are no programmes.",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Programmes Page" }),
  },
});
