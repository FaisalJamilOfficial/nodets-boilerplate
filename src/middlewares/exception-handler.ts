// module imports
import { Request, Response, NextFunction } from "express";

export const exceptionHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
