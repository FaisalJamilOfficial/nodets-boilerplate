// module imports
import http from "http";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import logger from "morgan";
import cors from "cors";
import chalk from "chalk";
import mongoose from "mongoose";

// file imports
import "./bin/www";
import indexRouter from "./routes";
import SocketManager from "./utils/socket-manager";
import errorHandler from "./middlewares/error-handler";

// destructuring assignments
const { NODE_ENV, MONGO_URI, PORT } = process.env;

// variable initializations

const serverFunction = async () => {
  console.log(chalk.hex("#00BFFF")("***Server Execution Started!***"));

  try {
    const app = express();
    const server = http.createServer(app);
    mongoose.set("strictQuery", false);
    app.use(
      cors({
        origin: ["http://localhost:3000", "https://admin.app.com"],
        credentials: true,
      })
    );

    new SocketManager().initializeSocket({ server, app });

    const connect = mongoose.connect(MONGO_URI || "");

    connect.then(
      (_db) => {
        const port = PORT || "5000";
        server.listen(port, () => {
          console.log(`***App is running at port: ${chalk.underline(port)}***`);
        });
        console.log(chalk.hex("#01CDEF")("***Database Connected!***"));
      },
      (err) => {
        console.log(err);
      }
    );

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use("/public/", express.static(path.join("dist/public/")));

    app.use("/api/v1", indexRouter);

    app.get("/reset-password", (_req, res) => {
      res.sendFile(path.join(__dirname, "public/reset-password.html"));
    });

    app.get("/", (_req, res) => {
      res.sendFile(path.join(__dirname, "public/image.png"));
    });

    // catch 404 and forward to error handler
    app.use(function (_req: Request, _res: Response, next: NextFunction) {
      next(new Error("Not Found|||404"));
    });

    // error handler
    app.use(errorHandler);
  } catch (error) {
    console.log(error);
  }
};

serverFunction();
console.log(
  chalk.hex("#607070")(chalk.underline(NODE_ENV || "".toUpperCase()))
);
