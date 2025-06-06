import type { NextFunction, Request, Response } from "express";

// i should use cookie-parser

export const parseCookies = (req: Request, res: Response, next: NextFunction) => {
    const cookieString = req.headers.cookie;
    
    if (!cookieString) return(next());

    const cookies = cookieString.split(";");

    try {
        // @ts-ignore
        const cookiePairs: [key: string, val: string][] = cookies.map(cookie => cookie.split("="));
        
        const cookieHash: any = {};

        for (const [key, val] of cookiePairs) {
            cookieHash[key] = val;
        }

        req.cookies = cookieHash;
    } catch (err) {
        console.log(err);
    }
    console.log(req.cookies);
    return next();
}