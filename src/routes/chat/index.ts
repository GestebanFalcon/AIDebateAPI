import { Router } from "express";
import { handleCreateConversation } from "./controller/createConversation";
import validateData from "@/middleware/validateSchema";
import { conversationRequestSchema, sendMessageSchema } from "@/schemas/chat";
import { authRequired } from "@/middleware/authRequired";
import { handleSendMessage } from "./controller/sendMessage";

export const router = Router();

router.post("/conversations/create", authRequired, validateData(conversationRequestSchema), handleCreateConversation);
router.post("/messages/send", authRequired, validateData(sendMessageSchema), handleSendMessage);
