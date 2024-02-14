// module imports
import express, { Request, Response } from "express";

// file imports
import {
  verifyToken,
  verifyAdmin,
  verifySecret,
} from "../middlewares/authenticator";
import { exceptionHandler } from "../middlewares/exception-handler";

// destructuring assignments

// variable initializations
const router = express.Router();

router.delete(
  "/clean/DB",
  verifyToken,
  verifyAdmin,
  verifySecret,
  exceptionHandler(async (_req: Request, res: Response) => {
    res.json({ message: "Operation completed successfully!" });
  })
);

export default router;
