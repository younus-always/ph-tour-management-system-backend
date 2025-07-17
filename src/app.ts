import express, { Request, Response } from "express";
import cors from 'cors'
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";

const app = express();

// Middleware
app.use(express.json());
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