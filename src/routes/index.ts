// module imports
import express, { Request, Response } from "express";

// file imports
import admin from "../modules/admin/route";
import auth from "../modules/auth/route";
import element from "../modules/element/route";
import message from "../modules/message/route";
import user from "../modules/user/route";

// destructuring assignments
const { POSTMAN_URL } = process.env;

// variable initializations
const router = express.Router();

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/element", element);
router.use("/message", message);
router.use("/user", user);

router.use("/docs", (_req: Request, res: Response) =>
  res.redirect(POSTMAN_URL || "")
);

export default router;
