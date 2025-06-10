import { messages, type insertMessage } from "@/db/chat/message";
import db from "@/db/db";
import { sendMessageSchema, type sendMessageType } from "@/schemas/chat";
import type { ExtendedRequest } from "@/ts/extendedRequest";
import type { Response } from "express";

export const handleSendMessage = async (req: ExtendedRequest, res: Response) => {

    //typescript.  Auth middleware should come before here
    const token = req.token!;

    const body: sendMessageType = req.body;

    try {
        const data: insertMessage = {...body, authorId: token.sub};
        const [ message ] = await db.insert(messages).values(data).returning();
        if (!message) {
            throw new Error();
        }
        res.status(201).json({ message });
        return;
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}