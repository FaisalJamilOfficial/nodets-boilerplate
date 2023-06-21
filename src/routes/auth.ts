// module imports
import express from "express";

// file imports
import * as authController from "../controllers/auth.js";
import * as usersController from "../controllers/users.js";
import { USER_TYPES } from "../configs/enums.js";
import { asyncHandler } from "../middlewares/async-handler.js";
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
  asyncHandler(async (req: any, res: any) => {
    const { type } = req.query;
    const { email, password, name } = req.body;
    const args = {
      email,
      password,
      name,
      type,
    };
    const response = await authController.register(args);
    res.json(response);
  })
);

router.post(
  "/login",
  asyncHandler(async (req: any, res: any) => {
    const { type } = req.query;
    const { email, password } = req.body;
    const args = {
      email,
      password,
      type,
    };
    const response = await authController.login(args);
    res.json(response);
  })
);

router.post(
  "/login/phone",
  verifyToken,
  verifyOTP,
  verifyUserToken,
  asyncHandler(async (req: any, res: any) => {
    const { _id: user } = req?.user;
    const args = { user };
    const response = await usersController.getUser(args);
    res.json(response);
  })
);

router.post(
  "/login/google",
  asyncHandler(async (req: any, res: any) => {
    const { googleId } = req.body;
    const args = {
      googleId,
    };
    const response = await usersController.getUser(args);
    res.json(response);
  })
);

router.post(
  "/login/facebook",
  asyncHandler(async (req: any, res: any) => {
    const { facebookId } = req.body;
    const args = {
      facebookId,
    };
    const response = await usersController.getUser(args);
    res.json(response);
  })
);

router.post(
  "/login/twitter",
  asyncHandler(async (req: any, res: any) => {
    const { twitterId } = req.body;
    const args = {
      twitterId,
    };
    const response = await usersController.getUser(args);
    res.json(response);
  })
);

router.post(
  "/login/admin",
  asyncHandler(async (req: any, res: any) => {
    const { email, password } = req.body;
    const args = {
      email,
      password,
      type: ADMIN,
    };
    const response = await authController.login(args);
    res.json(response);
  })
);

router.post(
  "/register/admin",
  asyncHandler(async (req: any, res: any) => {
    const { secret } = req.headers;
    const { email, password, type } = req.body;
    const args = {
      email,
      password,
      type: type ?? ADMIN,
      name: type,
    };
    if (secret !== SECRET) throw new Error("Invalid SECRET!|||400");
    const response = await authController.addAdmin(args);
    res.json(response);
  })
);

export default router;
