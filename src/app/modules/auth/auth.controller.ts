import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { AuthService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      passport.authenticate("local", async (err: any, user: any, info: any) => {
            if (err) {
                  return next(new AppError(err.statusCode || 401, err.message))
            };
            if (!user) {
                  return next(new AppError(httpStatus.BAD_REQUEST, info.message))
            };

            const userTokens = createUserTokens(user)
            setAuthCookie(res, userTokens);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...rest } = user.toObject();

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: "User Logged In Successfully.",
                  data: {
                        accessToken: userTokens.accessToken,
                        refreshToken: userTokens.refreshToken,
                        user: rest
                  }
            })
      })(req, res, next)
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
      const { refreshToken } = req.cookies
      if (!refreshToken) {
            throw new AppError(httpStatus.BAD_REQUEST, "Refresh token missing from cookies.")
      }
      const tokenInfo = await AuthService.getNewAccessToken(refreshToken);
      setAuthCookie(res, tokenInfo)

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Access token refreshed successfully.",
            data: tokenInfo
      })
});

const logout = catchAsync(async (req: Request, res: Response) => {
      res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
      });
      res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
      });

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged out successfully.",
            data: null
      })
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
      const { oldPassword, newPassword } = req.body;
      const decodedToken = req.user as JwtPayload;

      await AuthService.changePassword(oldPassword, newPassword, decodedToken)

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Password Changed Successfully.",
            data: null
      })
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
      const { email } = req.body;
      await AuthService.forgotPassword(email)

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Email Sent Successfully.",
            data: null
      })
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
      const decodedToken = req.user as JwtPayload;
      await AuthService.resetPassword(req.body, decodedToken)

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Password Reset Successfully.",
            data: null
      })
});


const setPassword = catchAsync(async (req: Request, res: Response) => {
      const { password } = req.body;
      const decodedToken = req.user as JwtPayload;

      await AuthService.setPassword(decodedToken.userId, password)

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Password Set Successfully.",
            data: null
      })
});

const googleCallbackController = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      let redirectTo = req.query.state ? req.query.state as string : "";

      if (redirectTo.startsWith("/")) {
            redirectTo = redirectTo.slice(1)
      };
      if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found.")
      };
      const tokenInfo = createUserTokens(user)
      setAuthCookie(res, tokenInfo)

      res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
});


export const AuthController = {
      credentialsLogin,
      getNewAccessToken,
      logout,
      changePassword,
      resetPassword,
      setPassword,
      forgotPassword,
      googleCallbackController
};