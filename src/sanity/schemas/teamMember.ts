import { defineType, defineField } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Committee Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "division",
      title: "Division",
      type: "string",
      options: {
        list: [
          { title: "Executive", value: "executive" },
          { title: "Trading", value: "trading" },
          { title: "Operations", value: "operations" },
          { title: "Events", value: "events" },
          { title: "Technology", value: "technology" },
          { title: "Marketing", value: "marketing" },
          { title: "ICWiT", value: "icwit" },
          { title: "QTC", value: "qtc" },
          { title: "EduFund", value: "edufund" },
        ],
      },
      initialValue: "executive",
    }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 3 }),
    defineField({ name: "photoUrl", title: "Photo URL", type: "url" }),
    defineField({ name: "linkedIn", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 99 }),
  ],
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
