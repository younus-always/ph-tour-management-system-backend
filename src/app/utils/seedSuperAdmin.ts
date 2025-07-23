import { envVars } from "../config/env"
import { IAuthProvider, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcryptjs from 'bcryptjs'

export const seedSuperAdmin = async () => {
      try {
            const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

            if (isSuperAdminExist) {
                  console.log("Super Admin Already Exist")
                  return;
            }
            console.log("Trying to create super admin")

            const hashPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

            const authProvider: IAuthProvider = {
                  provider: "creadentials",
                  providerId: envVars.SUPER_ADMIN_EMAIL
            }

            const payload = {
                  name: "Super admin",
                  role: Role.SUPER_ADMIN,
                  email: envVars.SUPER_ADMIN_EMAIL,
                  password: hashPassword,
                  isVerified: true,
                  auths: [authProvider]
            }

            const superAdmin = await User.create(payload)
            console.log("Super admin created successfully")
            console.log(superAdmin)
      } catch (error) {
            console.log(error)
      }
}