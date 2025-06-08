import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "../auth/user";
import { conversations } from "./conversation";

export const conversationMembers = pgTable("conversationMembers", {
    userId: uuid().notNull().references(() => users.id, { onDelete: "cascade" }),
    conversationId: uuid().notNull().references(() => conversations.id, { onDelete: "cascade" }),
    createdAt: timestamp().notNull().defaultNow()
}, (table) => [
    primaryKey({ columns: [table.userId, table.conversationId] })
]);