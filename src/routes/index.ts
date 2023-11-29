// module imports
import express, { Request, Response } from "express";

// file imports
import admins from "./admin";
import auth from "./auth";
import messages from "./message";
import users from "./user";

// destructuring assignments
const { POSTMAN_URL } = process.env;

// variable initializations
const router = express.Router();

router.use("/admin", admins);
router.use("/auth", auth);
router.use("/message", messages);
router.use("/user", users);

router.use("/docs", (_req: Request, res: Response) =>
  res.redirect(POSTMAN_URL || "")
);

export default router;
