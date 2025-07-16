import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
      PORT: string,
      DB_URL: string,
      NODE_ENV: "development" | "production"
};

const loadEnvVariable = (): EnvConfig => {
      const requireEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV"]

      requireEnvVariables.forEach((key) => {
            if (!process.env[key]) {
                  throw new Error(`Missing require environment variable ${key}`)
            }
      })
      return {
            PORT: process.env.PORT as string,
            DB_URL: process.env.DB_URL as string,
            NODE_ENV: process.env.NODE_ENV as "development" | "production"
      }
}

export const envVars = loadEnvVariable();