/* eslint-disable @typescript-eslint/no-explicit-any */
import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';
import { IsActive } from './../modules/user/user.interface';
import AppError from "../errorHelpers/AppError";


passport.use(
      new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
      }, async (email: string, password: string, done) => {
            try {

                  const user = await User.findOne({ email })
                  if (!user) {
                        return done(null, false, { message: "User does not exists." })
                  };

                  if (!user.isVerified) {
                        done("User account is not verified")
                  };
                  if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
                        done(`User account is ${user.isActive}`)
                  };
                  if (user.isDeleted) {
                        throw new AppError(404, "User account is deleted")
                  };

                  const googleAuthenticated = user.auths.some(providerObjects => providerObjects.provider === "google"
                  );

                  if (googleAuthenticated && !user.password) {
                        return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." })
                  }

                  const isPasswordMatch = await bcryptjs.compare(password, user.password as string)
                  if (!isPasswordMatch) {
                        return done(null, false, { message: "Password does not match." })
                  }

                  return done(null, user)
            } catch (error) {
                  done(error)
            }
      })
);


passport.use(
      new GoogleStrategy({
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
      },
            async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
                  try {
                        const email = profile.emails?.[0].value

                        if (!email) {
                              return done(null, false, { message: "Email not found!" })
                        };

                        let user = await User.findOne({ email })

                        if (user && !user.isVerified) {
                              return done(null, false, { message: "User is not verified" })
                        };
                        if (user && (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE)) {
                              done(`User account is ${user.isActive}`)
                        };
                        if (user && user.isDeleted) {
                              return done(null, false, { message: "User is Deleted" })
                        };

                        if (!user) {
                              user = await User.create({
                                    email,
                                    name: profile.displayName,
                                    picture: profile.photos?.[0].value,
                                    role: Role.USER,
                                    isVerified: true,
                                    auths: [
                                          {
                                                provider: "google",
                                                providerId: profile.id
                                          }
                                    ]
                              })
                        };

                        return done(null, user)
                  } catch (error) {
                        return done(error)
                  }
            }
      )
);

// frontend localhost:5173/login?redirect=/booking  ->  localhost:5000/api/v1/auth/google?redirect=/booking  ->  passport ->  Google OAuth Consent ->  gmail login ->  successful ->  callback url localhost:5000/api/v1/auth/google/callback ->  db store  -> token

// Bridge == Google -> user db store -> token
//Custom -> email , password, role : USER, name... -> registration -> DB -> 1 User create
//Google -> req -> google -> successful : Jwt Token : Role , email -> DB - Store -> token - api access

passport.serializeUser((user: any, done) => {
      done(null, user._id)
});

passport.deserializeUser(async (id: string, done) => {
      try {
            const user = await User.findById(id)
            done(null, user)
      } catch (error) {
            done(error)
      }
});