import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../auth/user";
import { conversations } from "./conversation";

export const messages = pgTable("messages", {
    id: uuid().primaryKey().defaultRandom(),
    content: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp(),
    authorId: uuid().references(() => users.id, { onDelete: "set null"}),
    conversationId: uuid().references(() => conversations.id, { onDelete: "cascade" })
});

export type insertMessage = typeof messages.$inferInsert;
export type selectMessage = typeof messages.$inferSelect;