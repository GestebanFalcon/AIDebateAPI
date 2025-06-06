import type { NextFunction, Request, Response } from "express";
import { ZodError, type z } from "zod";

// blog post tutorial

export default function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map(issue => ({
                    message: `${issue.path.join('.')} is ${issue}`
                }));
                res.status(400).json({error: "Invalid Data", details: ""});
            } else {
                res.status(500).json({error: "Internal Server Error"});
            }
        }
    }
}