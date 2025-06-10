import type { JwtPayloadData } from "@/helpers/auth";
import type { Request } from "express";

// eventually also include header data and union it. I'm too lazy for that right now.
export interface ExtendedRequest extends Request {
    token?: JwtPayloadData
}

export interface AuthenticatedRequest extends Request {
    token: JwtPayloadData
}