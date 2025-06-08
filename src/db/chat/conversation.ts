import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const conversations = pgTable("conversations", {
   id: uuid().defaultRandom().primaryKey(),
   name: text().notNull().default("New Conversation"),
   createdAt: timestamp().notNull().defaultNow(),
   updatedAt: timestamp()
});