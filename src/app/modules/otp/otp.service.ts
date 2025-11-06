import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { generateOTP } from "../../utils/generateOTP";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";

const OTP_EXPIRATION = 2 * 60; // 2 minutes

const sendOTP = async (email: string, name: string) => {
      const user = await User.findOne({ email });
      if (!user) {
            throw new AppError(404, "User Not Found")
      };
      if (user.isVerified) {
            throw new AppError(401, "You are already verified")
      };

      const otp = generateOTP();
      const redisKey = `otp:${email}`;

      await redisClient.set(redisKey, otp, {
            expiration: {
                  type: "EX",
                  value: OTP_EXPIRATION
            }
      });

      await sendEmail({
            to: email,
            subject: "Your OTP Code",
            templateName: "otp",
            templateData: {
                  name,
                  otp
            }
      });
};

const verifyOTP = async (email: string, otp: string) => {
      const user = await User.findOne({ email });
      if (!user) {
            throw new AppError(404, "User Not Found")
      };
      if (user.isVerified) {
            throw new AppError(401, "You are already verified")
      };

      const redisKey = `otp:${email}`;
      const savedOtp = await redisClient.get(redisKey);

      if (!savedOtp || savedOtp !== otp) {
            throw new AppError(401, "Invalid OTP")
      }
      await Promise.all([
            User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
            redisClient.del(redisKey)
      ]);
};


export const OTPService = {
      sendOTP,
      verifyOTP
};