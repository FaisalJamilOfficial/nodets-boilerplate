// module imports
import express, { Request, Response } from "express";

// file imports
import admin from "./admin";
import auth from "./auth";
import element from "./element";
import message from "./message";
import user from "./user";

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
