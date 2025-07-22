import { Types } from "mongoose";

export enum Role {
      SUPER_ADMIN = "SUPER_ADMIN",
      ADMIN = "ADMIN",
      USER = "USER",
      GUIDE = "GUIDE"
};

// auth proiders
/**
* email, password
* google authentication
**/

export interface IAuthProvider {
      provider: "google" | "creadentials";  // "Google", "Credential"
      providerId: string
};

export enum IsActive {
      ACTIVE = "ACTIVE",
      INACTIVE = "INACTIVE",
      BLOCKED = "BLOCKED"
};

export interface IUser {
      name: string;
      email: string;
      password?: string;
      phone?: string;
      picture?: string;
      address?: string;
      isActive?: IsActive;
      isVerified?: boolean;
      isDeleted?: boolean;
      role: Role;
      auths: IAuthProvider[];
      bookings?: Types.ObjectId[];
      guides?: Types.ObjectId[]
};