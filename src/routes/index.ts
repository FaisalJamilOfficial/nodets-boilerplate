// module imports
import { Request, Response, Router } from "express";

// file imports
import admin from "../modules/admin/route";
import auth from "../modules/auth/route";
import element from "../modules/element/route";
import message from "../modules/message/route";
import user from "../modules/user/route";
import { upload } from "../middlewares/uploader";
import { exceptionHandler } from "../middlewares/exception-handler";
import { verifyToken } from "../middlewares/authenticator";

// destructuring assignments
const { POSTMAN_URL } = process.env;

// variable initializations
const router = Router();

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/element", element);
router.use("/message", message);
router.use("/user", user);

router.use("/docs", (_req: Request, res: Response) =>
  res.redirect(POSTMAN_URL || "")
);

router.use("/ping", (_req: Request, res: any) => res.send("OK"));

router.use(
  "/upload/file",
  verifyToken,
  upload().single("file"),
  exceptionHandler((req: Request, res: Response) => {
    res.json(req.file);
  })
);

router.use(
  "/upload/files",
  verifyToken,
  upload().array("files"),
  exceptionHandler((req: Request, res: Response) => {
    res.json(req.files);
  })
);

export default router;
