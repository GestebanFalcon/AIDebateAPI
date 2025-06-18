import { z } from "zod";

export const registerSchema = z.object({
    email: z.string(),
    password: z.string()
});

export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
});

export const profileSchema = z.object({
    id: z.string(),
    username: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
});
export type profileType = z.infer<typeof profileSchema>;