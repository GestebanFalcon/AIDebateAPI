import validateData from "@/middleware/validateSchema";
import { Router } from "express";
import { loginSchema, registerSchema } from "../../schemas/auth";
import { handleRegister } from "./controllers/register";
import { handleLogin } from "./controllers/login";
import { authRequired } from "@/middleware/authRequired";
import { handleGetUserProfile } from "./controllers/getUserProfile";

export const router = Router();

router.post("/register", validateData(registerSchema), handleRegister);
router.post("/login", validateData(loginSchema), handleLogin);
router.get("/profiles/get", authRequired, handleGetUserProfile);