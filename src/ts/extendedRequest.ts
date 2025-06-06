import type { JwtPayloadData } from "@/helpers/auth";
import type { Request } from "express";

// eventually also include header data and union it. I'm too lazy for that right now.
export default interface ExtendedRequest extends Request {
    token?: JwtPayloadData
}