import { drizzle } from "drizzle-orm/neon-serverless";

const db = drizzle({ connection: process.env.DATABASE_URI!, casing: "camelCase" });

export default db;