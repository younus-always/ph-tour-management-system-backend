export interface TErrorSources {
      path: string;
      message: string;
}

export interface TErrorResponse {
      statusCode: number;
      message: string,
      errorSources?: TErrorSources[];
}