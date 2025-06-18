import { Router } from "express";
import { handleCreateConversation } from "./controllers/createConversation";
import validateData from "@/middleware/validateSchema";
import { conversationRequestSchema, sendMessageSchema } from "@/schemas/chat";
import { authRequired } from "@/middleware/authRequired";
import { handleSendMessage } from "./controllers/sendMessage";
import { handleGetConversation } from "./controllers/getConversation";
import { handleGetConversations } from "./controllers/getConversations";

export const router = Router();

router.post("/conversations/create", authRequired, validateData(conversationRequestSchema), handleCreateConversation);
router.get("/conversations/get", authRequired, handleGetConversation);
router.get("/conversations/getAll", authRequired, handleGetConversations);
router.post("/messages/send", authRequired, validateData(sendMessageSchema), handleSendMessage);
