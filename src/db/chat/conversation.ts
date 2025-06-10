import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const conversations = pgTable("conversations", {
   id: uuid().defaultRandom().primaryKey(),
   name: text().notNull().default("New Conversation"),
   createdAt: timestamp().notNull().defaultNow(),
   updatedAt: timestamp()
});

export type insertConversation = typeof conversations.$inferInsert;
export type selectConversation = typeof conversations.$inferSelect;