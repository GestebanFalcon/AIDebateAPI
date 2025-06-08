import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

export const usersToConversations = pgTable("usersToConversations", {
    userId: uuid().notNull(),
    conversationId: uuid().notNull()
}, (table) => [
    primaryKey({ columns: [table.userId, table.conversationId]})
]);