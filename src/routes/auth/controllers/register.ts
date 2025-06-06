import type { Request, Response } from "express";
import db from "@/db/db";
import { users, type insertUsers } from "@/db/auth/user";
import bcrypt from "bcrypt"

export const handleRegister = async (req: Request, res: Response) => {

    const { email, password }: { email: string, password: string } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userData: insertUsers = { email, hashedPassword };
        const user = await db.insert(users).values(userData);
        res.status(201).json({ user });
        return;
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error", details: err });
        return;
    }
}