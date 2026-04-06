import { defineType, defineField } from "sanity";

export default defineType({
  name: "sponsorAlgothon",
  title: "Algothon Sponsor",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Company Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      options: {
        list: [
          { title: "Platinum", value: "platinum" },
          { title: "Gold", value: "gold" },
          { title: "Silver", value: "silver" },
          { title: "Bronze", value: "bronze" },
        ],
      },
      initialValue: "bronze",
    }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "websiteUrl", title: "Website URL", type: "url" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "name", subtitle: "tier", media: "logo" },
  },
});
