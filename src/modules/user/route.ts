// module imports
import { Request, Response, Router } from "express";

// file imports
import TwilioManager from "../../utils/twilio-manager";
import * as authController from "../auth/controller";
import * as notificationController from "../notification/controller";
import * as userController from "./controller";
import { upload } from "../../middlewares/uploader";
import { exceptionHandler } from "../../middlewares/exception-handler";
import { IRequest } from "../../configs/types";
import {
  verifyOTP,
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyUserToken,
} from "../../middlewares/authenticator";

// destructuring assignments

// variable initializations
const router = Router();

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
    upload().single("image"),
    exceptionHandler(async (req: IRequest, res: Response) => {
      const image = req.file || {};
      const { _id: user } = req.user;
      const { firstName, lastName } = req.body;
      const args = {
        firstName,
        lastName,
        //   image: image?.key,
        image: image?.filename,
      };
      const response = await userController.updateUserById(user, args);
      res.json(response);
    })
  )
  .get(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
      const { page, limit } = req.query;
      let { keyword } = req.query;
      keyword = keyword?.toString() || "";
      const args = {
        user,
        keyword,
        limit: Number(limit),
        page: Number(page),
      };
      const response = await userController.getUsers(args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: IRequest, res: Response) => {
      let { user } = req.query;
      user = user?.toString() || "";
      const response = await userController.deleteUserById(user);
      res.json(response);
    })
  );

router.put(
  "/phone",
  verifyToken,
  verifyOTP,
  verifyUserToken,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user, phone } = req.user;
    const args = { phone };
    const response = await userController.updateUserById(user, args);
    res.json(response);
  })
);
router.put(
  "/password",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user, email, type } = req.user;
    const { password, newPassword } = req.body;
    const args = { password, email, type };
    await authController.login(args);
    args.password = newPassword;
    const response = await userController.updateUserById(user, args);
    res.json(response);
  })
);

router
  .route("/otp")
  .post(
    verifyToken,
    verifyUser,
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
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
  .route("/notification")
  .all(verifyToken, verifyUser)
  .get(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
      const { page, limit } = req.query;
      const args = { user, limit: Number(limit), page: Number(page) };
      const response = await notificationController.getNotifications(args);
      res.json(response);
    })
  )
  .patch(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
      await notificationController.readNotifications(user);
      res.json({ message: "Operation completed successfully!" });
    })
  );

router.get(
  "/me",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req.user;
    const { device } = req.query;
    const args = { user, device: device?.toString() || "" };
    const response = await userController.getUserProfile(args);
    res.json(response);
  })
);

router.put(
  "/fcm",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req?.user;
    const { fcm } = req.body;
    const args = { fcm };
    const response = await userController.updateUserById(user, args);
    res.json(response);
  })
);

router.get(
  "/:user",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const { user } = req.params;
    const response = await userController.getUserById(user);
    res.json(response);
  })
);

export default router;
