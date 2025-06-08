import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { aiMembers } from "./aiMember";
import { conversations } from "./conversation";

export const aiMessages = pgTable("aiMessages", {
    id: uuid().primaryKey().defaultRandom(),
    content: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp(),
    authorId: uuid().references(() => aiMembers.id, { onDelete: "set null"}),
    conversationId: uuid().notNull().references(() => conversations.id, { onDelete: "cascade" })
});