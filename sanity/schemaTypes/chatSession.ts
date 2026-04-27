import { defineType, defineField } from "sanity"

export const chatSession = defineType({
  name: "chatSession",
  title: "Chat Session",
  type: "document",
  fields: [
    defineField({ name: "sessionId", type: "string", title: "Session ID" }),
    defineField({ name: "topicId", type: "number", title: "Telegram Topic ID" }),
    defineField({ name: "createdAt", type: "datetime", title: "Created At" }),
    defineField({
      name: "messages",
      type: "array",
      title: "Messages",
      of: [{
        type: "object",
        fields: [
          { name: "role", type: "string", title: "Role" },
          { name: "text", type: "string", title: "Text" },
          { name: "timestamp", type: "datetime", title: "Timestamp" },
        ],
      }],
    }),
  ],
})
