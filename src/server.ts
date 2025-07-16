/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";


let server: Server;


const startServer = async () => {
      try {
            await mongoose.connect("mongodb+srv://todo-app:todoapp@cluster0.1aj11.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0");
            console.log("Connected to DB")

            server = app.listen(5000, () => {
                  console.log("Server is listening on port 5000")
            })
      } catch (error) {
            console.log(error)
      }
};
startServer();


process.on("SIGTERM", () => {
      console.log("SIGTERM signal received... Server Shutting Down....");

      if (server) {
            server.close(() => {
                  process.exit(1)
            });
      }
      process.exit(1);
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

//! Unhandle Rejection Error
// Promise.reject(new Error("I forgot to catch this promise!"));
//! Uncaught Exception Error
// throw new Error("I forgot to handle this local error!");
