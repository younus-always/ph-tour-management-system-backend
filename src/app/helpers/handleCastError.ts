/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import { TErrorResponse } from "../interfaces/err.types"

export const handleCastError = (err: mongoose.Error.CastError): TErrorResponse => {
      return {
            statusCode: 400,
            message: "Invalide MongoDB ObjectID. Please provide a valid id"
      }
}