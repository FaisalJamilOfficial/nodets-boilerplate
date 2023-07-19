// module imports
import express, { Request, Response } from "express";

// file imports
import * as authController from "../controllers/auth";
import * as usersController from "../controllers/users";
import { USER_TYPES } from "../configs/enums";
import { exceptionHandler } from "../middlewares/exception-handler";
import {
  verifyOTP,
  verifyToken,
  verifyUserToken,
} from "../middlewares/authenticator";

// destructuring assignments
const { ADMIN } = USER_TYPES;
const { SECRET } = process.env;

// variable initializations
const router = express.Router();

router.post(
  "/register",
  exceptionHandler(async (req: Request, res: Response) => {
    const { type } = req.query;
    const { email, password, name } = req.body;
    const args = { email, password, name, type };
    const response = await authController.register(args);
    res.json({ token: response });
  })
);

router.post(
  "/login",
  exceptionHandler(async (req: Request, res: Response) => {
    const { type } = req.query;
    const { email, password } = req.body;
    const args = { email, password, type };
    const response = await authController.login(args);
    res.json({ token: response });
  })
);

router.post(
  "/login/phone",
  verifyToken,
  verifyOTP,
  verifyUserToken,
  exceptionHandler(async (req: Request, res: Response) => {
    const { _id: user } = req?.user;
    const args = { user };
    const response: any = await usersController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/google",
  exceptionHandler(async (req: Request, res: Response) => {
    const { googleId } = req.body;
    const args = { googleId };
    const response: any = await usersController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/facebook",
  exceptionHandler(async (req: Request, res: Response) => {
    const { facebookId } = req.body;
    const args = { facebookId };
    const response: any = await usersController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/twitter",
  exceptionHandler(async (req: Request, res: Response) => {
    const { twitterId } = req.body;
    const args = { twitterId };
    const response: any = await usersController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/admin",
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const args = { email, password, type: ADMIN };
    const response = await authController.login(args);
    res.json({ token: response });
  })
);

router.post(
  "/register/admin",
  exceptionHandler(async (req: Request, res: Response) => {
    const { secret } = req.headers;
    const { email, password, type } = req.body;
    const args = { email, password, type: type ?? ADMIN, name: type };
    if (secret !== SECRET) throw new Error("Invalid SECRET!|||400");
    const response = await authController.addAdmin(args);
    res.json({ token: response });
  })
);

export default router;
