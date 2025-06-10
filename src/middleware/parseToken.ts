import { base64UrlToJson, verifyJwt, type JwtPayloadData } from "@/helpers/auth";
import { jwtPayloadSchema } from "@/schemas/tokens";
import type { ExtendedRequest } from "@/ts/extendedRequest";
import type { NextFunction, Request, Response } from "express";

export const parseToken = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;
    
    if (!token) {
        return next();  
    }

    const splitToken = token.split('.');
    if (splitToken.length !== 3) {
        return next();
    }

    const encodedHeaders = splitToken[0];
    const encodedPayload = splitToken[1];
    const signature = splitToken[2];

    const headers = base64UrlToJson(encodedHeaders);
    const payload: JwtPayloadData = base64UrlToJson(encodedPayload);
    
    try {
        jwtPayloadSchema.parse(payload);
    } catch (err) {
        if (!(err instanceof Error)) return next();
        console.log(err);
        return next();
    }

    const isVerified = verifyJwt(`${encodedHeaders}.${encodedPayload}`, signature);

    if (!isVerified) return next();

    req.token = { ...payload };

    return next();
}