/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const user = await UserServices.createUser(req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully.",
            data: user
      })
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id
      const payload = req.body
      const verifiedToken = req.user
      const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Updated Successfully.",
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
      updateUser,
      getAllUsers
};