import { Types } from "mongoose";

export enum Role {
      SUPER_ADMIN = "SUPER_ADMIN",
      ADMIN = "ADMIN",
      USER = "USER",
      GUIDE = "GUIDE"
};

export interface IAuthProvider {
      provider: "google" | "creadentials";
      providerId: string;
};

export enum IsActive {
      ACTIVE = "ACTIVE",
      INACTIVE = "INACTIVE",
      BLOCKED = "BLOCKED"
};

export interface IUser {
      _id?: Types.ObjectId,
      name: string;
      email: string;
      password?: string;
      phone?: string;
      picture?: string;
      address?: string;
      role: Role;
      isActive?: IsActive;
      isVerified?: boolean;
      isDeleted?: boolean;
      auths: IAuthProvider[];
      bookings?: Types.ObjectId[];
      guides?: Types.ObjectId[]
};