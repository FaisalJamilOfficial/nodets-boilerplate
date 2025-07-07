// module imports
import { Request, Response, Router } from "express";

// file imports
import StripeManager from "../../utils/stripe-manager";
import { exceptionHandler } from "../../middlewares/exception-handler";
import { IRequest } from "../../configs/types";
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from "../../middlewares/authenticator";

// destructuring assignments

// variable initializations
const stripeManager = new StripeManager();
const router = Router();

router.post(
  "/transfers",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const { user, amount, description } = req.body;
    const args = { amount, destination: user, description };
    const response = await stripeManager.createTransfer(args);
    res.json(response);
  }),
);

router.post(
  "/account-link",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user, email } = req.user;
    const { account } = req.body;
    const args = { account, email, user };
    const response = await stripeManager.createAccountLink(args);
    res.json(response);
  }),
);

router.post(
  "/webhook/external-account",
  exceptionHandler(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];
    const rawBody = req.body;
    // console.log("SIGNATURE: ", JSON.stringify(signature));
    // console.log("RAW_BODY: ", JSON.stringify(rawBody));
    const args = { rawBody, signature };
    const event = await stripeManager.constructWebhooksEvent(args);
    return res.status(200).send({
      message: "Done",
      event,
    });
  }),
);

export default router;
