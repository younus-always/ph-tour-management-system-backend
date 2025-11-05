/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources } from "../interfaces/err.types";
import { deleteImageFromCloudinary } from "../config/multer.config";


export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
      if (envVars.NODE_ENV === "development") {
            console.log("From Global Error Handler:", err)
      };

      if (req.file) {
            await deleteImageFromCloudinary(req.file.path)
      };
      if (req.files && Array.isArray(req.files) && req.files.length) {
            const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
            await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url)))
      }

      let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      let message = "Something Went Wrong!";
      let errorSources: TErrorSources[] = [];

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
      // Mongoose Validation Error
      else if (err.name === "ValidationError") {
            const simplifiedError = handleValidationError(err)
            statusCode = simplifiedError.statusCode
            message = simplifiedError.message
            errorSources = simplifiedError.errorSources as TErrorSources[]
      }
      // Zod Error
      else if (err.name === "ZodError") {
            const simplifiedError = handleZodError(err)
            statusCode = simplifiedError.statusCode
            message = simplifiedError.message
            errorSources = simplifiedError.errorSources as TErrorSources[]
      } else if (err instanceof AppError) {
            statusCode = err.statusCode
            message = err.message
      } else if (err instanceof Error) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR
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