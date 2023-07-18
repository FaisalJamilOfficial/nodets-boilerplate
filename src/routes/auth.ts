// module imports
import express from "express";

// file imports
import * as authController from "../controllers/auth.js";
import * as usersController from "../controllers/users.js";
import { USER_TYPES } from "../configs/enums.js";
import { exceptionHandler } from "../middlewares/exception-handler.js";
import {
  verifyOTP,
  verifyToken,
  verifyUserToken,
} from "../middlewares/authenticator.js";

// destructuring assignments
const { ADMIN } = USER_TYPES;
const { SECRET } = process.env;

// variable initializations
const router = express.Router();

router.post(
  "/register",
  exceptionHandler(async (req: any, res: any) => {
    const { type } = req.query;
    const { email, password, name } = req.body;
    const args = { email, password, name, type };
    const response = await authController.register(args);
    res.json({ token: response });
  })
);

router.post(
  "/login",
  exceptionHandler(async (req: any, res: any) => {
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
  exceptionHandler(async (req: any, res: any) => {
    const { _id: user } = req?.user;
    const args = { user };
    const response: any = await usersController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/google",
  exceptionHandler(async (req: any, res: any) => {
    const { googleId } = req.body;
    const args = { googleId };
    const response: any = await usersController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/facebook",
  exceptionHandler(async (req: any, res: any) => {
    const { facebookId } = req.body;
    const args = { facebookId };
    const response: any = await usersController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/twitter",
  exceptionHandler(async (req: any, res: any) => {
    const { twitterId } = req.body;
    const args = { twitterId };
    const response: any = await usersController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/admin",
  exceptionHandler(async (req: any, res: any) => {
    const { email, password } = req.body;
    const args = { email, password, type: ADMIN };
    const response = await authController.login(args);
    res.json({ token: response });
  })
);

router.post(
  "/register/admin",
  exceptionHandler(async (req: any, res: any) => {
    const { secret } = req.headers;
    const { email, password, type } = req.body;
    const args = { email, password, type: type ?? ADMIN, name: type };
    if (secret !== SECRET) throw new Error("Invalid SECRET!|||400");
    const response = await authController.addAdmin(args);
    res.json({ token: response });
  })
);

export default router;
