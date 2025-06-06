import { z } from "zod";

export const jwtPayloadSchema = z.object({
    sub: z.string(),
    email: z.string(),
    iat: z.number(),
    exp: z.number(),
    role: z.enum(["user", "admin"]),
    aud: z.string()
});

export const jwtHeadersSchema = z.object({

});