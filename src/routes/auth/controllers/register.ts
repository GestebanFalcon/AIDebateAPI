import type { Request, Response } from "express";
import db from "@/db/db";
import { users, type insertUsers } from "@/db/auth/user";
import bcrypt from "bcrypt"
import { profiles, type insertProfiles } from "@/db/auth/profile";

export const handleRegister = async (req: Request, res: Response) => {

    const { email, password }: { email: string, password: string } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userData: insertUsers = { email, hashedPassword };
        const [ user ]= await db.insert(users).values(userData).returning();
        if (!user) throw new Error("The user isn't created??? idk man");
        const profileData: insertProfiles = { userId: user.id };
        const profile = await db.insert(profiles).values(profileData);
        res.status(201).json({ success: "User Created" });
        return;
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error", details: err });
        return;
    }
}