import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";

export const profiles = pgTable("profiles", {
    id: uuid().primaryKey().defaultRandom(),
    username: text().notNull().default('New User'),
    userId: uuid().notNull().references(() => users.id, {onDelete: "cascade"}).unique(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
});
export type insertProfiles = typeof profiles.$inferInsert;
export type selectProfiles = typeof profiles.$inferSelect;