// module imports
import { Request, Response, NextFunction } from "express";

export const exceptionHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
