import { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express"
import AppError from '../errorHelpers/AppError'
import { verifyToken } from '../utils/jwt'
import { envVars } from '../config/env'
import httpStatus from 'http-status-codes'
import { User } from '../modules/user/user.model'
import { IsActive } from '../modules/user/user.interface'

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
      try {
            const accessToken = req.headers.authorization

            if (!accessToken) {
                  throw new AppError(httpStatus.UNAUTHORIZED, "JWT Token Missing")
            };

            const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;
            const isUserExist = await User.findOne({ email: verifiedToken.email })

            if (!isUserExist) {
                  throw new AppError(httpStatus.NOT_FOUND, "User does not exist.")
            };
            if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
                  throw new AppError(httpStatus.FORBIDDEN, `User account is ${isUserExist.isActive}`)
            };
            if (isUserExist.isDeleted) {
                  throw new AppError(httpStatus.FORBIDDEN, "User account is deleted")
            };

            if (!authRoles.includes(verifiedToken.role)) {
                  throw new AppError(httpStatus.FORBIDDEN, "Access denied: insufficient permissions.")
            };
            req.user = verifiedToken
            next()
      } catch (error) {
            next(error)
      }
};