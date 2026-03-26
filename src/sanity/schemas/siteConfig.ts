import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteConfig",
  title: "Site Configuration",
  type: "document",
  fields: [
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({
      name: "stats",
      title: "Key Statistics",
      type: "object",
      fields: [
        defineField({ name: "members", title: "Members", type: "string" }),
        defineField({ name: "founded", title: "Founded Year", type: "string" }),
        defineField({ name: "offers", title: "Offers Secured", type: "string" }),
        defineField({ name: "witMembers", title: "ICWiT Members", type: "string" }),
      ],
      description: "Industry Partners and Events Hosted are derived automatically. ICWiT Events derived from events with 'icwit' category.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Configuration" }),
  },
});
