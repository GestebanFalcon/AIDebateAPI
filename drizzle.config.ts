import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" });

export default defineConfig({
    dialect: "postgresql",
    schema: [
        "./src/db/auth/*",
        "./src/db/chat/*"
    ],
    out: "./migrations",
    dbCredentials: {
        url: process.env.DATABASE_URI!
    }
})