import { conversations } from "@/db/chat/conversation";
import { conversationMembers } from "@/db/chat/conversationMember";
import db from "@/db/db";
import type { ExtendedRequest } from "@/ts/extendedRequest";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const handleGetConversations = async (req: ExtendedRequest, res: Response) => {
    
    // typescript break here guys beware
    const token = req.token!;
    const userId = token.sub;
    try {
        const result = await db.select()
            .from(conversationMembers)
            .innerJoin(conversations, eq(conversationMembers.conversationId, conversations.id))
            .where(eq(conversationMembers.userId, userId));
        
        const conversationList = result.map(item => item.conversations);

        res.status(200).json({ conversations: conversationList });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}