import { defineType, defineField } from "sanity";

// Editable copy for the news & research index (`/news-and-research`). The feed
// items come from the `post`, `newsletter`, and `marketRecap` document types.
export default defineType({
  name: "newsPage",
  title: "News & Research Page",
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
      description: "Shown when there are no posts, newsletters, or recaps.",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "News & Research Page" }),
  },
});
