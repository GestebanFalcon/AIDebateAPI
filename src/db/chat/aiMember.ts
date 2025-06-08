import { identities } from "@/ts/identities";
import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

// this typescript is so stupid oh my days why do i need record<string, string>. I can pass in a newly created array, but now a previously created array. No way chat
export const identityEnum = pgEnum("identity", ["George Washington", `Felix "XQC" Lengyel`, "Lyndon B. Johnson"]);

export const aiMembers = pgTable("aiMembers", {
    id: uuid().primaryKey().defaultRandom(),
    identity: identityEnum().notNull(),
    createdAt: timestamp().notNull().defaultNow()
});