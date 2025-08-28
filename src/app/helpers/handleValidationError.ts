import mongoose from "mongoose"
import { TErrorResponse, TErrorSources } from "../interfaces/err.types"
import httpStatus from "http-status-codes";

export const handleValidationError = (err: mongoose.Error.ValidationError): TErrorResponse => {
      const errorSources: TErrorSources[] = []
      const errors = Object.values(err.errors)
      errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
      }))

      return {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Validation Error Occured!",
            errorSources
      }
}