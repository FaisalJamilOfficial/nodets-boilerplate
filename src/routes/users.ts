// module imports
import express, { Request, Response } from "express";

// file imports
import * as authController from "../controllers/auth";
import * as notificationsController from "../controllers/notifications";
import * as usersController from "../controllers/users";
import TwilioManager from "../utils/twilio-manager";
import directories from "../configs/directories";
import { upload } from "../middlewares/uploader";
import { exceptionHandler } from "../middlewares/exception-handler";
import {
  verifyOTP,
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyUserToken,
} from "../middlewares/authenticator";
import { IRequest } from "../configs/types";

// destructuring assignments
const { IMAGES_DIRECTORY } = directories;

// variable initializations
const router = express.Router();

router
  .route("/")
  .all(verifyToken, verifyAdmin)
  .post(
    exceptionHandler(async (req: Request, res: Response) => {
      const { email, password, phone, type } = req.body;
      const args = { email, password, phone, type };
      const response = await authController.register(args);
      res.json({ token: response });
    })
  )
  .put(
    upload(IMAGES_DIRECTORY).single("image"),
    exceptionHandler(async (req: IRequest, res: Response) => {
      const image = req.file || {};
      const { _id: user } = req?.user;
      const { firstName, lastName } = req.body;
      const args = {
        user,
        firstName,
        lastName,
        //   image: image?.key,
        image: image?.filename,
      };
      const response = await usersController.updateUser(args);
      res.json({ data: response });
    })
  )
  .get(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req?.user;
      const { page, limit, keyword } = req.query;
      const args = { user, keyword, limit: Number(limit), page: Number(page) };
      const response = await usersController.getUsers(args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { user } = req.query;
      const args = { user };
      const response = await usersController.deleteUser(args);
      res.json({ data: response });
    })
  );

router.put(
  "/phone",
  verifyToken,
  verifyOTP,
  verifyUserToken,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user, phone } = req?.user;
    const args = { user, phone };
    const response = await usersController.updateUser(args);
    res.json({ data: response });
  })
);
router.put(
  "/password",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user, email, type } = req?.user;
    const { password, newPassword } = req.body;
    const args = { password, newPassword, email, user, type };
    await authController.login(args);
    args.password = args.newPassword;
    const response = await usersController.updateUser(args);
    res.json({ data: response });
  })
);

router
  .route("/otp")
  .post(
    verifyToken,
    verifyUser,
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req?.user;
      const { phone } = req.body;
      const args = { user, phone };
      const response = await new TwilioManager().sendOTP(args);
      res.json({ token: response });
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      const { phone } = req.body;
      const args: any = { phone };
      const user = await usersController.getUser(args);
      args.user = user;
      const response = await new TwilioManager().sendOTP(args);
      res.json({ token: response });
    })
  );

router
  .route("/password/email")
  .post(
    exceptionHandler(async (req: Request, res: Response) => {
      const { email } = req.body;
      const args = { email };
      await authController.emailResetPassword(args);
      res.json({ message: "Password reset link sent to your email address!" });
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      const { password, user, token } = req.body;
      const args = { password, user, token };
      await authController.resetPassword(args);
      res.json({ message: "Password reset successfully!" });
    })
  );

router
  .route("/notifications")
  .all(verifyToken, verifyUser)
  .get(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req?.user;
      const { page, limit } = req.query;
      const args = { user, limit: Number(limit), page: Number(page) };
      const response = await notificationsController.getNotifications(args);
      res.json(response);
    })
  )
  .patch(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req?.user;
      const args = {
        user,
      };
      await notificationsController.readNotifications(args);
      res.json({ message: "notifications read successfully!" });
    })
  );

router.get(
  "/me",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    res.json({ data: req?.user });
  })
);

router.get(
  "/:user",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { user } = req.params;
    const args = { user };
    const response = await usersController.getUser(args);
    res.json({ data: response });
  })
);

export default router;
