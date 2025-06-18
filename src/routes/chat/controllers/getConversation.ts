import { conversations } from "@/db/chat/conversation";
import { conversationMembers } from "@/db/chat/conversationMember";
import { messages } from "@/db/chat/message";
import db from "@/db/db";
import { getConversationSchema, type getConversationType } from "@/schemas/chat";
import type { ExtendedRequest } from "@/ts/extendedRequest";
import { eq } from "drizzle-orm";
import type { Response } from "express";

/**Gets all columns from the conversation and all columns of the past messages */
export const handleGetConversation = async (req: ExtendedRequest, res: Response) => {
    //typescript annoying asl
    const token = req.token!

    const { conversationId } = req.params;
    if (!conversationId) {
        res.status(400).json({ error: "I genuinely don't know how you get this error. Missing parameter" });
        return;
    }
    
    try {
        const [ conversation ] = await db.select().from(conversations).where(eq(conversations.id, conversationId));
        if (!conversation) {
            throw new Error();
        }
        const members = await db.select().from(conversationMembers).where(eq(conversationMembers.conversationId, conversationId));
        const [ self ] = members.filter(member => (member.userId === token.sub))
        if (!self) {
            res.status(403).json({ error: "User Not a Member of Conversation" });
            return;
        }
        const conversationMessages = await db.select().from(messages).where(eq(messages.conversationId, conversationId));
        
        const response = { conversation, members, messages: conversationMessages };
        res.status(200).json({...response});
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error "});
    }
}