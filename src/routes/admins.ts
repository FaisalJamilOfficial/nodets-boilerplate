// module imports
import express from "express";

// file imports
import * as adminsController from "../controllers/admins";
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
  exceptionHandler(async (req: any, res: any) => {
    const { secret } = req.headers;
    if (secret !== SECRET) throw new Error("Invalid SECRET!|||400");
    await adminsController.cleanDB();
    res.json({ message: "Operation completed successfully!" });
  })
);

export default router;
