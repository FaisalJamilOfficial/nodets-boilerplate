// module imports
import express from "express";

// file imports
import * as messagesController from "../controllers/messages.js";
import { verifyToken, verifyUser } from "../middlewares/authenticator.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { upload } from "../middlewares/uploader.js";
import directories from "../configs/directories.js";

// destructuring assignments
const { ATTACHMENTS_DIRECTORY } = directories;

// variable initializations
const router = express.Router();

router
  .route("/")
  .all(verifyToken, verifyUser)
  .post(
    upload(ATTACHMENTS_DIRECTORY).array("attachments", 8),
    asyncHandler(async (req: any, res: any) => {
      const { _id: userFrom, name: username } = req?.user;
      const { user: userTo, text } = req.body;
      const attachments = req.files || [];
      const args = {
        userFrom,
        username,
        userTo,
        text,
        attachments,
      };
      const response = await messagesController.send(args);
      res.json(response);
    })
  )
  .get(
    asyncHandler(async (req: any, res: any) => {
      const { _id: user1 } = req.user;
      const { conversation, limit, page, user: user2 } = req.query;
      const args = {
        conversation,
        user1,
        user2,
        limit: Number(limit),
        page: Number(page),
      };
      const response = await messagesController.getMessages(args);
      res.json(response);
    })
  )
  .put(
    asyncHandler(async (req: any, res: any) => {
      const { message, text, status } = req.body;
      const args = { message, text, status };
      const response = await messagesController.updateMessage(args);
      res.json(response);
    })
  )
  .patch(
    asyncHandler(async (req: any, res: any) => {
      const { _id } = req?.user;
      const { conversation } = req.body;
      const args = { conversation, userTo: _id };
      const response = await messagesController.readMessages(args);
      res.json(response);
    })
  );

router.get(
  "/conversations",
  verifyToken,
  verifyUser,
  asyncHandler(async (req: any, res: any) => {
    const { _id: user } = req?.user;
    const { limit, page, q } = req.query;
    const args = {
      user,
      limit: Number(limit),
      page: Number(page),
      q,
    };
    const response = await messagesController.getConversations(args);
    res.json(response);
  })
);

export default router;
