import type { ExtendedRequest } from "@/ts/extendedRequest";
import type { NextFunction, Response } from "express";

export const authRequired = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.token) {
        res.status(404).json({ Error: "Missing authentication credentials "});
        return;
    } 
    next();
    return;
} 