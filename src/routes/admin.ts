// module imports
import express, { Request, Response } from "express";

// file imports
import * as adminController from "../controllers/admin";
import {
  verifyToken,
  verifyAdmin,
  verifySecret,
} from "../middlewares/authenticator";
import { exceptionHandler } from "../middlewares/exception-handler";

// destructuring assignments
const { SECRET } = process.env;

// variable initializations
const router = express.Router();

router.delete(
  "/clean/DB",
  verifyToken,
  verifyAdmin,
  verifySecret,
  exceptionHandler(async (req: Request, res: Response) => {
    await adminController.cleanDB();
    res.json({ message: "Operation completed successfully!" });
  })
);

export default router;
