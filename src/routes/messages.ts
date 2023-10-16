// module imports
import express, { Request, Response } from "express";

// file imports
import * as messagesController from "../controllers/messages";
import directories from "../configs/directories";
import { verifyToken, verifyUser } from "../middlewares/authenticator";
import { exceptionHandler } from "../middlewares/exception-handler";
import { upload } from "../middlewares/uploader";
import { IRequest } from "../configs/types";

// destructuring assignments
const { PUBLIC_DIRECTORY } = directories;

// variable initializations
const router = express.Router();

router
  .route("/")
  .all(verifyToken, verifyUser)
  .post(
    upload(PUBLIC_DIRECTORY).array("attachments", 8),
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: userFrom, name: username } = req?.user;
      const { user: userTo, text } = req.body;
      const attachments = req.files || [];
      const args: any = { userFrom, username, userTo, text, attachments: [] };
      if (attachments)
        attachments.forEach((attachment: any) =>
          args.attachments.push({
            // path: attachment?.key,
            path: attachment?.filename,
            type: attachment?.mimetype,
          })
        );
      const response = await messagesController.send(args);
      res.json({ data: response });
    })
  )
  .get(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user1 } = req.user;
      const {  limit, page, user } = req.query;
      let { conversation } = req.query;
      conversation = (conversation || "").toString();
      const args = {
        conversation,
        user1,
        user2: (user || "").toString(),
        limit: Number(limit),
        page: Number(page),
      };
      const response = await messagesController.getMessages(args);
      res.json(response);
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { message } = req.query;
      const { text, status } = req.body;
      const args = { text, status };
      message = (message || "").toString();
      const response = await messagesController.updateMessage(
        message,
        args
      );
      res.json({ data: response });
    })
  )
  .patch(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id } = req?.user;
      const { conversation } = req.body;
      const args = { conversation, userTo: _id };
      await messagesController.readMessages(args);
      res.json({ message: "messages read successfully!" });
    })
  );

router.get(
  "/conversations",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req?.user;
    const { limit, page } = req.query;
    let { keyword } = req.query;
    keyword = (keyword || "").toString(); 
    const args = {
      user,
      limit: Number(limit),
      page: Number(page),
      keyword,
    };
    const response = await messagesController.getConversations(args);
    res.json(response);
  })
);

export default router;
