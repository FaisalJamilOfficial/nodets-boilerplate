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
        firstName,
        lastName,
        //   image: image?.key,
        image: image?.filename,
      };
      const response = await usersController.updateUser(user, args);
      res.json({ data: response });
    })
  )
  .get(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req?.user;
      const { page, limit, keyword } = req.query;
      const args = {
        user,
        keyword: (keyword || "").toString(),
        limit: Number(limit),
        page: Number(page),
      };
      const response = await usersController.getUsers(args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: IRequest, res: Response) => {
      let { user } = req.query;
      user = (user || "").toString();
      const response = await usersController.deleteUser(user);
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
    const args = { phone };
    const response = await usersController.updateUser(user, args);
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
    const args = { password, email, type };
    await authController.login(args);
    args.password = newPassword;
    const response = await usersController.updateUser(user, args);
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
      const args = { phone };
      const response = await new TwilioManager().sendOTP(args);
      res.json({ token: response });
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
      await notificationsController.readNotifications(user);
      res.json({ message: "notifications read successfully!" });
    })
  );

router.get(
  "/me",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req.user;
    const { device } = req.body;
    const args = { user, device };
    const response = await usersController.getUserProfile(args);
    res.json({ data: response });
  })
);

router.get(
  "/:user",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const response = await usersController.getUser(req.params);
    res.json({ data: response });
  })
);

export default router;
