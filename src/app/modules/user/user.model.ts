import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
      provider: { type: String, required: true },
      providerId: { type: String, required: true }
}, {
      _id: false
})

const userSchema = new Schema<IUser>({
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true },
      password: { type: String },
      phone: { type: String },
      picture: { type: String },
      address: { type: String },
      role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER
      },
      auths: [authProviderSchema],
      isActive: {
            type: String,
            enum: Object.values(IsActive),
            default: IsActive.ACTIVE
      },
      isVerified: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false }
}, {
      versionKey: false,
      timestamps: true
});

export const User = model<IUser>("User", userSchema);