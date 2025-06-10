import { Router } from "express";

export const router = Router();
import { router as chatRouter } from "./chat/index.ts";
import { router as authRouter } from "./auth/index.ts";
import type { ExtendedRequest } from "@/ts/extendedRequest.ts";
import { authRequired } from "@/middleware/authRequired.ts";


router.use("/chat", chatRouter);
router.use("/auth", authRouter);
router.use("/ping", (req: ExtendedRequest, res) => {
    res.status(200).json(["pong", req.token]);
});