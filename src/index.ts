

import express, { Request, Response, NextFunction,Errback,ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"
import { AppRouter } from "./AppRouter";
import "./controllers/routeController";
import "dotenv/config";
import errorHandler from "./controllers/decorators/errorHandler";


const app = express();
// Middleware to parse JSON bodies
app.use(bodyParser.json());
const PORT = 3000;
app.use(cors())

// Middleware to handle CORS errors



app.use(AppRouter.getInstance());
app.use(errorHandler);



const mongoUri = process.env.MONGOBD_URI;
if (!mongoUri) {
  throw new Error("MONGOBD_URI environment variable is not defined.");
}
// Log the MongoDB URI
mongoose
  .connect(mongoUri)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`love is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
