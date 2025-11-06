/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";


let server: Server;

const startServer = async () => {
      try {
            await mongoose.connect(envVars.DB_URL);
            console.log("Connected to DB")
            server = app.listen(envVars.PORT, () => {
                  console.log(`Server is listening on port ${envVars.PORT}`)
            })
      } catch (error) {
            console.log(error)
      }
};
(async () => {
      await connectRedis()
      await startServer()
      await seedSuperAdmin()
})();

process.on("SIGTERM", () => {
      console.log("SIGTERM signal received... Server Shutting Down....");

      if (server) {
            server.close(() => {
                  process.exit(1)
            });
      }
      process.exit(1);
});

process.on("SIGINT", () => {
      console.log("SIGINT Signal Received... Sever Shutting Down.")

      if (server) {
            server.close(() => {
                  process.exit(1)
            })
      }
      process.exit(1)
});

process.on("unhandledRejection", (err) => {
      console.log("Unhandle Rejection detected... Server Shutting Down....", err);

      if (server) {
            server.close(() => {
                  process.exit(1)
            });
      }
      process.exit(1);
});

process.on("uncaughtException", (err) => {
      console.log("Uncaught Exception detected... Server shutting down...", err);

      if (server) {
            server.close(() => {
                  process.exit(1);
            });
      };
      process.exit(1);
});
