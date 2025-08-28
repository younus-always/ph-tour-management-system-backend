import { TErrorResponse } from "../interfaces/err.types"
import httpStatus from "http-status-codes";

export const handleDuplicateError = (err: any): TErrorResponse => {
      let errMessage: string;
      const duplicate = err.message.match(/"([^"]*)"/)[1];
      const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
      const regexDivision = /^(Dhaka|Rajshahi|Khulna|Barisal|Sylhet|Rangpur|Mymensingh|Chattogram)$/i;
      const emailMsg = `The email address ${duplicate} already registered.`;
      const divisionMsg = `This division name ${duplicate} already exists.`;

      if (regexEmail.test(duplicate)) {
            errMessage = emailMsg;
      } else if (regexDivision.test(duplicate)) {
            errMessage = divisionMsg
      } else {
            errMessage = err.message
      };

      return {
            statusCode: httpStatus.CONFLICT,
            message: errMessage
      }
};