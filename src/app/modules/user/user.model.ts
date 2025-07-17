import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
      provider: { type: String, required: true },
      providerId: { type: String, required: true }
}, {
      versionKey: false,
      _id: false
})

const UserSchema = new Schema<IUser>({
      name: { type: String, required: true },
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
      isActive: {
            type: String,
            enum: Object.values(IsActive),
            default: IsActive.ACTIVE
      },
      isVerified: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false },
      auths: [authProviderSchema],

}, {
      versionKey: false,
      timestamps: true
});

export const User = model<IUser>("User", UserSchema);