import { defineType, defineField } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "endDate", title: "End Date", type: "date" }),
    defineField({ name: "time", title: "Time", type: "string", description: "e.g. 18:00 - 20:00" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Social", value: "social" },
          { title: "Bootcamp", value: "bootcamp" },
          { title: "AlgoCourse", value: "algocourse" },
          { title: "Competition", value: "competition" },
          { title: "Workshop", value: "workshop" },
          { title: "Quant Session", value: "quant-session" },
          { title: "QTC", value: "qtc" },
          { title: "ICWiT", value: "icwit" },
          { title: "Company Presentation", value: "company-presentation" },
        ],
      },
      initialValue: "social",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({ name: "attendees", title: "Attendee Count", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "rsvpUrl", title: "RSVP URL", type: "url" }),
    defineField({ name: "publishDate", title: "Publish Date", type: "date" }),
    defineField({ name: "expiryDate", title: "Expiry Date", type: "date" }),
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
  },
});
