import { profiles } from "@/db/auth/profile";
import db from "@/db/db";
import type { profileType } from "@/schemas/auth";
import type { ExtendedRequest } from "@/ts/extendedRequest";
import { eq } from "drizzle-orm";
import type { Response } from "express";

export const handleGetUserProfile = async (req: ExtendedRequest, res: Response) => {

    //warning i used !
    const userId = req.token!.sub;

    try {
        const [ profile ]: profileType[] = await db.select().from(profiles).where(eq(profiles.userId, userId));
        if (!profile) {
            res.status(404).json({ error: "Profile Not Found" });
            return;
        }
        res.status(200).json({ profile });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}