// module imports
import { Request, Response, Router } from "express";

// file imports

import { exceptionHandler } from "../../middlewares/exception-handler";
import {
  verifyAdminToken,
  verifyAPIKey,
} from "../../middlewares/authenticator";

// destructuring assignments

// variable initializations
const router = Router();

router.delete(
  "/clean/DB",
  verifyAdminToken,
  verifyAPIKey,
  exceptionHandler(async (_req: Request, res: Response) => {
    res.json({ message: "Operation completed successfully!" });
  })
);

export default router;
