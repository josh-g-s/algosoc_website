import { defineType, defineField } from "sanity";

// Editable copy for the Algothon landing page header (`/programmes/algothon`).
// The individual editions (images, recap, sponsors, participants) come from the
// `algothon` document type.
export default defineType({
  name: "algothonPage",
  title: "Algothon Page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4 }),
    defineField({
      name: "emptyState",
      title: "Empty State Message",
      description: "Shown when there are no Algothon editions.",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Algothon Page" }),
  },
});
