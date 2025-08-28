import { NextFunction, Request, Response } from "express";
// import { envVars } from "../config/env";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

// Avoid Repetition of try-catch
export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((err) => {
            // if (envVars.NODE_ENV === "development") {
            //       console.log("Try-Catch Async handler: ", err)
            // }
            next(err)
      })
};