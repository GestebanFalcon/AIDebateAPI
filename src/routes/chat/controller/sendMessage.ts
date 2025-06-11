import { conversations } from "@/db/chat/conversation";
import { conversationMembers } from "@/db/chat/conversationMember";
import { messages, type insertMessage } from "@/db/chat/message";
import db from "@/db/db";
import { sendMessageSchema, type sendMessageType } from "@/schemas/chat";
import { sockets } from "@/socket/socket";
import type { ExtendedRequest } from "@/ts/extendedRequest";
import { eq } from "drizzle-orm";
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
        const members = await db.select().from(conversationMembers).where(eq(conversationMembers.conversationId, body.conversationId));
        for (const member of members) {
            sockets.emitToUser(member.userId, 'receiveMessage', { message });
        }
        res.status(201).json({ message });
        return;
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}