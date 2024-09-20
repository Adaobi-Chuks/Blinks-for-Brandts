import { Application, json, urlencoded } from "express";
import { configDotenv } from "dotenv";
import { BASEPATH } from "../configs/constants.config";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorHandler from "./errors.middleware";
import indexRoutes, { baseController } from "../routes/index.route";
import actionRouter from "../routes/action.routes";

export default (app: Application) => {
  // Logging middleware
  app.use(morgan("combined"));

  // CORS middleware
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Configuration setup (dotenv)
  if (process.env.NODE_ENV !== 'production') configDotenv();

  // Body parsing middleware
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Security middleware
  app.use(helmet());

  // Cookie parsing middleware
  app.use(cookieParser());

  // Custom error handling middleware
  app.use(errorHandler);

  // Mounting routes
  app.use(BASEPATH, indexRoutes);
  app.use("/", baseController);
  app.use(`/`, actionRouter);
};