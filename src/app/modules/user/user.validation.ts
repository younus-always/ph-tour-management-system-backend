import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
      name: z
            .string({
                  error: (issue) => issue.input === undefined
                        ? "Name is required." : "Not a string"
            })
            .min(3, { message: "Name must be at least 3 characters long." })
            .max(30, { message: "Name cannot exceed 30 characters." }),
      email: z
            .string({
                  error: (issue) => issue.input === undefined
                        ? "Email is required." : "Not a string"
            })
            .email({ message: "Invalid email address format." }),

      password: z
            .string({
                  error: (issue) => issue.input === undefined
                        ? "Password is required."
                        : issue.code === "invalid_type"
                              ? "Password must be string."
                              : "Not a string"
            })
            .min(8, { error: "Password must be at least 8 characters long." })
            .regex(/^(?=.*[A-Z])/,
                  { error: "Password must contain at least 1 uppercase letter." })
            .regex(/^(?=.*[!@#$%^&*])/,
                  { error: "Password must contain at least 1 special character." })
            .regex(/^(?=.*\d)/,
                  { error: "Password must contain at least 1 number." }),
      phone: z
            .string({ error: "Phone number must be string." })
            .regex(/^(?:\+8801\d{9}|01\d{9})$/,
                  { message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX" })
            .optional(),
      address: z
            .string({ error: "Address must be string." })
            .max(200, { message: "Address cannot exceed 200 characters." })
            .optional()
});


export const updateUserZodSchema = z.object({
      name: z
            .string({
                  error: (issue) => issue.input === undefined
                        ? "Name is required." : "Not a string"
            })
            .min(3, { message: "Name must be at least 3 characters long." })
            .max(30, { message: "Name cannot exceed 30 characters." })
            .optional(),
      password: z
            .string({
                  error: (issue) => issue.input === undefined
                        ? "Password is required."
                        : issue.code === "invalid_type"
                              ? "Password must be string."
                              : "Not a string"
            })
            .min(8, { error: "Password must be at least 8 characters long." })
            .regex(/^(?=.*[A-Z])/,
                  { error: "Password must contain at least 1 uppercase letter." })
            .regex(/^(?=.*[!@#$%^&*])/,
                  { error: "Password must contain at least 1 special character." })
            .regex(/^(?=.*\d)/,
                  { error: "Password must contain at least 1 number." })
            .optional(),
      phone: z
            .string({ error: "Phone number must be string." })
            .regex(/^(?:\+8801\d{9}|01\d{9})$/,
                  { message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX" })
            .optional(),
      address: z
            .string({ error: "Address must be string." })
            .max(200, { message: "Address cannot exceed 200 characters." })
            .optional(),
      role: z
            //  .enum(["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"])
            .enum(Object.values(Role) as [string])
            .optional(),
      isActive: z
            .enum(Object.keys(IsActive) as [string])
            .optional(),
      isVerified: z
            .boolean({ error: "isVerified must be true or false." })
            .optional(),
      isDeleted: z
            .boolean({ error: "isDeleted must be true or false." })
            .optional()
});