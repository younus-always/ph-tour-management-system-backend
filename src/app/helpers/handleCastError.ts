import httpStatus from "http-status-codes";
import mongoose from "mongoose"
import { TErrorResponse } from "../interfaces/err.types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleCastError = (err: mongoose.Error.CastError): TErrorResponse => {
      return {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Invalide MongoDB ObjectID. Please provide a valid id."
      }
}