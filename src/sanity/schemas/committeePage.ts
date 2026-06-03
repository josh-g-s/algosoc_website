import { defineType, defineField } from "sanity";

// Editable copy for the committee page (`/about/committee`). The member cards
// come from `teamMember`, split into AlgoSoc and ICWiT by the `division` field.
export default defineType({
  name: "committeePage",
  title: "Committee Page",
  type: "document",
  fieldsets: [
    { name: "header", title: "Header" },
    { name: "algosoc", title: "AlgoSoc Section" },
    { name: "icwit", title: "ICWiT Section" },
  ],
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      fieldset: "header",
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2, fieldset: "header" }),

    defineField({ name: "algosocHeading", title: "Heading", type: "string", fieldset: "algosoc" }),
    defineField({
      name: "algosocEmpty",
      title: "Empty State",
      description: "Shown when there are no AlgoSoc committee members.",
      type: "string",
      fieldset: "algosoc",
    }),

    defineField({ name: "icwitHeading", title: "Heading", type: "string", fieldset: "icwit" }),
    defineField({
      name: "icwitEmpty",
      title: "Empty State",
      description: "Shown when there are no ICWiT committee members.",
      type: "string",
      fieldset: "icwit",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Committee Page" }),
  },
});
