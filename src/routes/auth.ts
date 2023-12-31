// module imports
import express, { Request, Response } from "express";

// file imports
import * as authController from "../controllers/auth";
import * as userController from "../controllers/user";
import { USER_TYPES } from "../configs/enum";
import { exceptionHandler } from "../middlewares/exception-handler";
import {
  verifyOTP,
  verifySecret,
  verifyToken,
  verifyUser,
  verifyUserToken,
} from "../middlewares/authenticator";
import { IRequest } from "../configs/types";

// destructuring assignments
const { ADMIN, CUSTOMER } = USER_TYPES;
const { SECRET } = process.env;

// variable initializations
const router = express.Router();

router.post(
  "/register/customer",
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const args = { email, password, name, type: CUSTOMER };
    const response = await authController.register(args);
    res.json({ token: response });
  })
);

router.post(
  "/login/customer",
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const args = { email, password, type: CUSTOMER };
    const response = await authController.login(args);
    res.json({ token: response });
  })
);

router.post(
  "/logout",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req.user;
    const { device } = req.body;
    const args = { user, device, shallRemoveFCM: true };
    await userController.updateUser(user, args);
    res.json({ message: "Operation completed successfully!" });
  })
);

router
  .route("/password/email")
  .post(
    exceptionHandler(async (req: Request, res: Response) => {
      const { email } = req.body;
      const args = { email };
      await authController.emailResetPassword(args);
      res.json({ message: "Operation completed successfully!" });
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      const { password, user, token } = req.body;
      const args = { password, user, token };
      await authController.resetPassword(args);
      res.json({ message: "Operation completed successfully!" });
    })
  );

router.post(
  "/login/phone",
  verifyToken,
  verifyOTP,
  verifyUserToken,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req?.user;
    const args = { user };
    const response: any = await userController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/google",
  exceptionHandler(async (req: Request, res: Response) => {
    const { googleId } = req.body;
    const args = { googleId };
    const response: any = await userController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/facebook",
  exceptionHandler(async (req: Request, res: Response) => {
    const { facebookId } = req.body;
    const args = { facebookId };
    const response: any = await userController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  "/login/twitter",
  exceptionHandler(async (req: Request, res: Response) => {
    const { twitterId } = req.body;
    const args = { twitterId };
    const response: any = await userController.getUser(args);
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
  verifySecret,
  exceptionHandler(async (req: Request, res: Response) => {
    const { secret } = req.headers;
    const { email, password, type } = req.body;
    const args = { email, password, type: type ?? ADMIN, name: type };
    const response = await authController.register(args);
    res.json({ token: response });
  })
);

export default router;
