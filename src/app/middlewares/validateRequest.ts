import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

// Higher Order Func -- zod schema validateRequest middleware
export const validateRequest = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
      try {
            req.body = await zodSchema.parseAsync(req.body)
            next()
      } catch (error) {
            next(error)
      }
};