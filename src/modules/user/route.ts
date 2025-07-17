// module imports
import { Request, Response, Router } from "express";

// file imports
import TwilioManager from "../../utils/twilio-manager";
import { User } from "./interface";
import * as authController from "../auth/controller";
import * as notificationController from "../notification/controller";
import * as userController from "./controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import { IRequest } from "../../configs/types";
import {
  verifyOTP,
  verifyAdminToken,
  verifyUserToken,
} from "../../middlewares/authenticator";

// destructuring assignments

// variable initializations
const router = Router();

router
  .route("/")
  .all(verifyAdminToken)
  .post(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const args = req.pick(["email", "password", "phone", "type"]);
      const user = await authController.registerUser(args as User);
      res.json({ token: user.getSignedjwtToken() });
    })
  )
  .put(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
      const args = req.pick(["firstName", "lastName", "image"]);
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
  verifyUserToken,
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
  verifyUserToken,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user, email, type } = req.user;
    const { password, newPassword } = req.body;
    const args = { password, email, type };
    await authController.loginUser(args);
    args.password = newPassword;
    const response = await userController.updateUserById(user, args);
    res.json(response);
  })
);

router
  .route("/otp")
  .post(
    verifyUserToken,
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
      const args = { ...req.pick(["phone"]), user };
      const response = await new TwilioManager().sendOTP(args);
      res.json({ token: response });
    })
  )
  .put(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const args = req.pick(["phone"]);
      const response = await new TwilioManager().sendOTP(args);
      res.json({ token: response });
    })
  );

router
  .route("/notification")
  .all(verifyUserToken)
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
  verifyUserToken,
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
  verifyUserToken,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req?.user;
    const args = req.pick(["fcm", "device"]);
    const response = await userController.updateUserById(user, args);
    res.json(response);
  })
);

router.get(
  "/:user",
  verifyAdminToken,
  exceptionHandler(async (req: Request, res: Response) => {
    const { user } = req.params;
    const response = await userController.getUserById(user);
    res.json(response);
  })
);

export default router;
