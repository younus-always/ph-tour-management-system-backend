/* eslint-disable @typescript-eslint/no-explicit-any */import { TErrorResponse } from "../interfaces/err.types"

export const handleDuplicateError = (err: any): TErrorResponse => {
      const mathedArray = err.message.match(/"([^"]*)"/)
      return {
            statusCode: 400,
            message: `${mathedArray[1]} already exist`
      }
}