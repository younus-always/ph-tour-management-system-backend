/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//       try {
//             // throw new Error("Fake Error")
//             // throw new AppError(httpStatus.BAD_REQUEST, "Fake Error")
//             const user = await UserServices.createUser(req.body);

//             res.status(httpStatus.CREATED).json({
//                   success: true,
//                   message: "User created successfully.",
//                   user
//             })
//       } catch (err: any) {
//             next(err);
//       }
// };

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const user = await UserServices.createUser(req.body);

      // res.status(httpStatus.CREATED).json({
      //       success: true,
      //       message: "User Created Successfully.",
      //       user
      // })
      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully.",
            data: user
      })
});

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const result = await UserServices.getAllUsers();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All users Retrived Successfully.",
            data: result.data,
            meta: result.meta
      })

});



export const UserControllers = {
      createUser,
      getAllUsers
};