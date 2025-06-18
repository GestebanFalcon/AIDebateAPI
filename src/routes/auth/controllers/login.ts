import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import db from "@/db/db";
import { users } from "@/db/auth/user";
import { eq } from "drizzle-orm";
import { generateDefaultTimestamps, generateJwt } from "@/helpers/auth";

export const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const [ user ] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
        res.status(400).json({ error: "User Does Not Exist"});
        return;
    }

    const passwordVerified = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordVerified) {
        res.status(401).json({ error: "Invalid Login Credentials"});
        return;
    }
    const { iat, exp } = generateDefaultTimestamps(15)
    const { jwt, error } = generateJwt({ data: {iat: iat.getTime(), exp: exp.getTime(), sub: user.id, email: user.email, role: "user", aud: "goon.com"}});

    if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
    
    console.log("giving cookie");
    res
    // .setHeader("Access-Control-Allow-Credentials", "true")
    .cookie("access_token", jwt, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    .status(200)
    .json({ success: "awesome"});

    return;

}