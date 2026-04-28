import { defineType, defineField } from "sanity"

export const productReview = defineType({
  name: "productReview",
  title: "Відгук",
  type: "document",
  fields: [
    defineField({ name: "productSlug", type: "string", title: "Slug товару" }),
    defineField({ name: "author", type: "string", title: "Автор" }),
    defineField({ name: "rating", type: "number", title: "Оцінка (1–5)" }),
    defineField({ name: "body", type: "text", title: "Коментар" }),
    defineField({ name: "approved", type: "boolean", title: "Підтверджено", initialValue: true }),
    defineField({ name: "createdAt", type: "datetime", title: "Дата" }),
  ],
  preview: {
    select: { title: "author", subtitle: "productSlug" },
  },
})
