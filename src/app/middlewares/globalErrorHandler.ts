/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources } from "../interfaces/err.types";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
      // if (envVars.NODE_ENV === "development") {
      //       console.log("From globalErrorHandler:", err)
      // }

      let errorSources: TErrorSources[] = [];
      let statusCode = 500;
      let message = "Something Went Wrong!";

      // Duplicate Error
      if (err.code === 11000) {
            const simplifiedError = handleDuplicateError(err)
            statusCode = simplifiedError.statusCode
            message = simplifiedError.message
      }
      // ObjectID Error / CastError 
      else if (err.name === "CastError") {
            const simplifiedError = handleCastError(err)
            statusCode = simplifiedError.statusCode
            message = simplifiedError.message
      }
      // Zod Error
      else if (err.name === "ZodError") {
            const simplifiedError = handleZodError(err)
            statusCode = simplifiedError.statusCode
            message = simplifiedError.message
            errorSources = simplifiedError.errorSources as TErrorSources[]
      }
      // Mongoose Validation Error
      else if (err.name === "ValidationError") {
            const simplifiedError = handleValidationError(err)
            statusCode = simplifiedError.statusCode
            message = simplifiedError.message
            errorSources = simplifiedError.errorSources as TErrorSources[]
      } else if (err instanceof AppError) {
            statusCode = err.statusCode
            message = err.message
      } else if (err instanceof Error) {
            statusCode = 500
            message = err.message
      }

      res.status(statusCode).json({
            success: false,
            message,
            errorSources,
            err: envVars.NODE_ENV === "development" ? err : null,
            stack: envVars.NODE_ENV === "development" ? err.stack : null
      })
};