import { pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid().primaryKey().notNull().defaultRandom(),
    email: text().notNull(),
    hashedPassword: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
});

export type insertUsers = typeof users.$inferInsert;
export type selectUsers = typeof users.$inferSelect;