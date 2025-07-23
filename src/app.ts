import express, { Request, Response } from "express";
import cors from 'cors'
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import "./app/config/passport";

const app = express();

// Middleware
app.use(expressSession({
      secret: envVars.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser())
app.use(cors());

// Routes 
app.use("/api/v1", router);


// main route
app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
            message: "Welcome to Tour Management System Backend."
      })
});

// Global Error Handler
app.use(globalErrorHandler);
// Not Found Route
app.use(notFound)

export default app;