/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorResponse, TErrorSources } from "../interfaces/err.types";

export const handleZodError = (err: any): TErrorResponse => {
      const errorSources: TErrorSources[] = []

      err.issues.forEach((issue: any) => {
            errorSources.push({
                  // path: issue.path.length > 1 && issue.path.reverse().join(" inside ")
                  //? Ex: path: "nickname inside lastname inside name"
                  path: issue.path[issue.path.length - 1],
                  message: issue.message
            })
      });

      return {
            statusCode: 400,
            message: "Zod Error",
            errorSources
      }
}