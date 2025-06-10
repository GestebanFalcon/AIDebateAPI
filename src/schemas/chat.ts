import { z } from "zod";

export const memberIdsSchema = z.array(z.string());
export type memberIdsType = z.infer<typeof memberIdsSchema>

export const conversationRequestSchema = z.object({
    memberIds: memberIdsSchema,
    conversationName: z.string()
});
export type conversationRequestType = z.infer<typeof conversationRequestSchema>;

export const sendMessageSchema = z.object({
    conversationId: z.string(),
    content: z.string().min(1)
});
export type sendMessageType = z.infer<typeof sendMessageSchema>;