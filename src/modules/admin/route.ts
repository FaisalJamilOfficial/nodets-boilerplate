// module imports
import express, { Request, Response } from "express";

// file imports

import { exceptionHandler } from "../../middlewares/exception-handler";
import {
  verifyToken,
  verifyAdmin,
  verifyKey,
} from "../../middlewares/authenticator";

// destructuring assignments

// variable initializations
const router = express.Router();

router.delete(
  "/clean/DB",
  verifyToken,
  verifyAdmin,
  verifyKey,
  exceptionHandler(async (_req: Request, res: Response) => {
    res.json({ message: "Operation completed successfully!" });
  })
);

export default router;
