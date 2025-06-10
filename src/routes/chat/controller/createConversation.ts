import { conversations, type insertConversation } from "@/db/chat/conversation";
import { conversationMembers, type insertConversationMember } from "@/db/chat/conversationMember";
import db from "@/db/db";
import { conversationRequestSchema, memberIdsSchema, type conversationRequestType, type memberIdsType } from "@/schemas/chat";
import type { AuthenticatedRequest, ExtendedRequest } from "@/ts/extendedRequest";
import type { Request, Response } from "express";

export const handleCreateConversation = async (req: ExtendedRequest, res: Response) => {

    //It must be done after using middleware. This is atrocious. 
    const userId = req.token!.sub;
    //@everyone im so sorry for doing this

    const body: conversationRequestType = req.body;

    const { memberIds, conversationName } = body;
    
    memberIds.push(userId);

    const members = [];

    try {
        const conversationData: insertConversation = { name: conversationName };
        const [ conversation ] = await db.insert(conversations).values(conversationData).returning();
        if (!conversation) throw new Error("Conversation Bugging");
        for (const id of memberIds) {
            const newMemberData: insertConversationMember = { conversationId: conversation.id, userId: id };
            const [ newMember ] = await db.insert(conversationMembers).values(newMemberData).returning();
            if (!newMember) throw new Error ("New Members Bugging");
            members.push(newMember);
        }
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    res.status(201).json({ members });
    return;
}