import { defineType, defineField } from "sanity"

export const chatSession = defineType({
  name: "chatSession",
  title: "Чат",
  type: "document",
  fields: [
    defineField({ name: "sessionId", type: "string", title: "ID сесії" }),
    defineField({ name: "topicId", type: "number", title: "Telegram Topic ID" }),
    defineField({ name: "createdAt", type: "datetime", title: "Дата створення" }),
    defineField({
      name: "messages",
      type: "array",
      title: "Повідомлення",
      of: [{
        type: "object",
        fields: [
          { name: "role", type: "string", title: "Роль" },
          { name: "text", type: "string", title: "Текст" },
          { name: "timestamp", type: "datetime", title: "Час" },
        ],
      }],
    }),
  ],
  preview: {
    select: { title: "sessionId", subtitle: "createdAt" },
  },
})
