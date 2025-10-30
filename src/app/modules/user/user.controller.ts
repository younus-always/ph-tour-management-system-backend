import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response) => {
      const user = await UserService.createUser(req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully.",
            data: user
      })
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
      const userId = req.params.id;
      const payload = req.body;
      const verifiedToken = req.user as JwtPayload;
      const user = await UserService.updateUser(userId, payload, verifiedToken);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Updated Successfully.",
            data: user
      })
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
      const result = await UserService.getAllUsers();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All users Retrieved Successfully.",
            data: result.data,
            meta: result.meta
      })

});



export const UserController = {
      createUser,
      updateUser,
      getAllUsers
};