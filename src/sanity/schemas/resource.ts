import { defineType, defineField } from "sanity";

export default defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Career", value: "career" },
          { title: "Bootcamp", value: "bootcamp" },
          { title: "AlgoCourse", value: "algocourse" },
          { title: "QTC", value: "qtc" },
          { title: "Quant Sessions", value: "quant-sessions" },
          { title: "EduFund", value: "edufund" },
          { title: "Reading List", value: "reading-list" },
          { title: "Slides", value: "slides" },
        ],
      },
      initialValue: "career",
    }),
    defineField({
      name: "fileType",
      title: "File Type",
      type: "string",
      options: {
        list: [
          { title: "PDF", value: "pdf" },
          { title: "Slides", value: "slides" },
          { title: "Jupyter Notebook", value: "jupyter" },
          { title: "Reading List", value: "reading-list" },
          { title: "Code", value: "code" },
        ],
      },
      initialValue: "pdf",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "fileUrl", title: "File URL", type: "url" }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 99 }),
  ],
  preview: {
    select: { title: "title", subtitle: "fileType" },
  },
});
