// module imports
import express, { Request, Response } from "express";

// file imports
import * as adminController from "../controllers/admin";
import { verifyToken, verifyAdmin } from "../middlewares/authenticator";
import { exceptionHandler } from "../middlewares/exception-handler";

// destructuring assignments
const { SECRET } = process.env;

// variable initializations
const router = express.Router();

router.delete(
  "/clean/DB",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const { secret } = req.headers;
    if (secret !== SECRET) throw new Error("Invalid SECRET!|||400");
    await adminController.cleanDB();
    res.json({ message: "Operation completed successfully!" });
  })
);

export default router;
