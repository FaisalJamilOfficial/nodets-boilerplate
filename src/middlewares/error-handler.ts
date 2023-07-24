// module imports
import { NextFunction, Request, Response } from "express";

class ErrorHandler extends Error {
  statusCode: any;
  constructor(message: any, statusCode: any) {
    super(message);
    this.statusCode = statusCode;
  }
}

const error = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let error = { ...err };
  error.message = err.message.toString().split("|||")[0] ?? err.message;
  error.statusCode = err.message.toString().split("|||")[1] ?? 500;

  console.error(err);

  if (err.name === "CastError") {
    const message = `Cast failed for value ${err.value}`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e: any) => e.message);
    error = new ErrorHandler(message, 400);
  }

  // duplicate value found
  if (err.code === 11000) {
    let field = Object.keys(err.keyPattern)[0];
    field = field.charAt(0).toUpperCase() + field.slice(1);
    const message = `${field} already used, try another one instead!`;
    error = new ErrorHandler(message, 400);
  }

  res.status(Number(error.statusCode)).json({
    error: error.message || "Server Error",
  });
};
export default error;
