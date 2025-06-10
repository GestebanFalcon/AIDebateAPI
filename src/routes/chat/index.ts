import { Router } from "express";
import { handleCreateConversation } from "./controller/createConversation";
import validateData from "@/middleware/validateSchema";
import { conversationRequestSchema } from "@/schemas/chat";
import { authRequired } from "@/middleware/authRequired";

export const router = Router();

router.post("/conversations/create", authRequired, handleCreateConversation);
