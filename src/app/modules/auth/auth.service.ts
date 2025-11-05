/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import { IAuthProvider, IsActive } from '../user/user.interface';
import jwt from "jsonwebtoken";
import { sendEmail } from '../../utils/sendEmail';

const getNewAccessToken = async (refreshToken: string) => {
      const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
      return {
            accessToken: newAccessToken
      }
};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
      const user = await User.findById(decodedToken.userId)
      const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

      if (!isOldPasswordMatch) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match.")
      };
      user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
      user!.save();
};


const forgotPassword = async (email: string) => {
      const isUserExist = await User.findOne({ email });

      if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
      }
      if (!isUserExist.isVerified) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
      }
      if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
      }
      if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
      }

      const jwtPayload = {
            userId: isUserExist._id,
            email: isUserExist.email,
            role: isUserExist.role
      };

      const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
            expiresIn: "10m"
      });
      const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

      sendEmail({
            to: isUserExist.email,
            subject: "Password Reset",
            templateName: "forgetPassword",
            templateData: {
                  name: isUserExist.name,
                  resetUILink
            }
      })
};

const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
      if (payload.id != decodedToken.userId) {
            throw new AppError(httpStatus.FORBIDDEN, "You cannot reset your password")
      };
      const isUserExist = await User.findById(decodedToken.userId);
      if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, "User does not exist")
      };

      const hashedPassword = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND));
      isUserExist.password = hashedPassword;
      await isUserExist.save();
};

const setPassword = async (userId: string, password: string) => {
      const user = await User.findById(userId);

      if (!user) throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
      if (user.password && user.auths.some(providerObj => providerObj.provider === "google")) {
            throw new AppError(httpStatus.BAD_REQUEST, "You have already set your password. Now you can change the password from your profile password update.")
      };

      const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

      const credentialProvider: IAuthProvider = {
            provider: "credentials",
            providerId: user.email
      };
      const auths: IAuthProvider[] = [...user.auths, credentialProvider];

      user.password = hashedPassword;
      user.auths = auths;
      await user.save();
};

export const AuthService = {
      getNewAccessToken,
      changePassword,
      resetPassword,
      setPassword,
      forgotPassword
};