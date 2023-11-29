// module imports
import { isValidObjectId, Types } from "mongoose";

// file imports
import * as notificationController from "./notification";
import ConversationModel from "../models/conversation";
import MessageModel from "../models/message";
import UserModel from "../models/user";
import { Conversation } from "../interfaces/conversation";
import { Message } from "../interfaces/message";
import {
  GetMessagesDTO,
  GetConversationsDTO,
  SendMessageDTO,
} from "../dto/message";
import {
  CONVERSATION_STATUSES,
  MESSAGE_STATUSES,
  NOTIFICATION_TYPES,
} from "../configs/enum";

// destructuring assignments
const { PENDING, ACCEPTED, REJECTED } = CONVERSATION_STATUSES;
const { NEW_MESSAGE } = NOTIFICATION_TYPES;
const { READ } = MESSAGE_STATUSES;
const { ObjectId } = Types;

/**
 * @description Add message
 * @param {String} userFrom sender user id
 * @param {String} userTo receiver user id
 * @param {String} text message text
 * @param {[object]} attachments message attachments
 * @returns {Object} message data
 */
export const addMessage = async (messageObj: Message) => {
  return await MessageModel.create(messageObj);
};

/**
 * @description Get chat messages
 * @param {String} conversation conversation id
 * @param {Number} limit messages limit
 * @param {Number} page messages page number
 * @param {String} text message text
 * @param {[object]} attachments OPTIONAL message attachments
 * @returns {Object} message data
 */
export const getMessages = async (params: GetMessagesDTO) => {
  const { conversation } = params;
  let { page, limit, user1, user2 } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  if (conversation) query.conversation = new ObjectId(conversation);
  else if (user1 && user2) {
    const userOne = new ObjectId(user1);
    const userTwo = new ObjectId(user2);
    query.$or = [
      { $and: [{ userTo: userOne }, { userFrom: userTwo }] },
      { $and: [{ userFrom: userOne }, { userTo: userTwo }] },
    ];
  } else throw new Error("Please enter conversation id!|||400");
  const [result] = await MessageModel.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
    {
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        data: [{ $skip: page * limit }, { $limit: limit }],
      },
    },
    { $unwind: "$totalCount" },
    {
      $project: {
        totalCount: "$totalCount.totalCount",
        totalPages: { $ceil: { $divide: ["$totalCount.totalCount", limit] } },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...result };
};

/**
 * @description Update message data
 * @param {String} message message id
 * @param {String} text message text
 * @param {String} status message status
 * @returns {Object} message data
 */
export const updateMessage = async (
  message: string,
  messageObj: Partial<Message>
) => {
  if (!message) throw new Error("Please enter message id!|||400");
  if (!isValidObjectId(message))
    throw new Error("Please enter valid message id!|||400");
  const messageExists = await MessageModel.findByIdAndUpdate(
    message,
    messageObj,
    { new: true }
  );
  if (!messageExists) throw new Error("Message not found!|||404");

  return messageExists;
};

/**
 * @description Delete message
 * @param {String} message message id
 * @returns {Object} message data
 */
export const deleteMessage = async (message: string) => {
  if (!message) throw new Error("Please enter message id!|||400");
  const messageExists = await MessageModel.findByIdAndDelete(message);
  if (!messageExists) throw new Error("Please enter valid message id!|||400");
  return messageExists;
};

/**
 * @description Add conversation
 * @param {String} userFrom sender user id
 * @param {String} userTo receiver user id
 * @returns {Object} conversation data
 */
export const addConversation = async (conversationObj: Conversation) => {
  const { userFrom, userTo } = conversationObj;
  const query = {
    $or: [
      { $and: [{ userTo: userFrom }, { userFrom: userTo }] },
      { $and: [{ userFrom }, { userTo }] },
    ],
  };

  let conversationExists: any = await ConversationModel.findOne(query);
  if (conversationExists) {
    if (conversationExists.status === PENDING) {
      if (userFrom === conversationExists.userTo.toString()) {
        conversationExists.status = ACCEPTED;
        await conversationExists.save();
      }
    } else if (conversationExists.status === REJECTED)
      throw new Error("Conversation request rejected!|||400");
  } else {
    const conversationObj: any = {};
    conversationObj.userTo = userTo;
    conversationObj.userFrom = userFrom;
    conversationExists = await ConversationModel.create(conversationObj);
  }
  return conversationExists;
};

/**
 * @description Get user conversations
 * @param {String} user user id
 * @param {String} keyword search keyword
 * @param {Number} limit conversations limit
 * @param {Number} page conversations page number
 * @returns {[Object]} array of conversations
 */
export const getConversations = async (params: GetConversationsDTO) => {
  const { user } = params;
  let { limit, page, keyword } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  const queryRegex: any = {};

  if (user) query.$or = [{ userTo: user }, { userFrom: user }];
  if (keyword) {
    keyword = keyword.trim();
    if (keyword !== "")
      queryRegex.$or = [
        { "lastMessage.text": { $regex: keyword, $options: "i" } },
        { "user.name": { $regex: keyword, $options: "i" } },
      ];
  }

  const [result] = await ConversationModel.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "messages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
        pipeline: [
          {
            $project: {
              text: 1,
              userFrom: 1,
              createdAt: 1,
              "attachments.type": 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$lastMessage" } },
    { $sort: { "lastMessage.createdAt": -1 } },
    {
      $project: {
        user: {
          $cond: {
            if: { $eq: ["$userTo", user] },
            then: "$userFrom",
            else: "$userTo",
          },
        },
        lastMessage: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { name: 1, image: 1 } }],
      },
    },
    {
      $unwind: { path: "$user" },
    },
    { $match: queryRegex },
    {
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        data: [{ $skip: page * limit }, { $limit: limit }],
      },
    },
    { $unwind: "$totalCount" },
    {
      $project: {
        totalCount: "$totalCount.totalCount",
        totalPages: { $ceil: { $divide: ["$totalCount.totalCount", limit] } },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...result };
};

/**
 * @description Send message
 * @param {String} userFrom sender user id
 * @param {String} userTo receiver user id
 * @param {String} text message text
 * @param {[object]} attachments message attachments
 * @returns {Object} message data
 */
export const send = async (params: SendMessageDTO) => {
  const { username } = params;

  const conversation = await addConversation(params);

  const message = await addMessage({
    ...params,
    conversation: conversation._id,
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  conversation.lastMessage = message;

  const user = message.userTo.toString();

  const notificationData = {
    user: message.userTo.toString(),
    message: message._id.toString(),
    messenger: message.userFrom.toString(),
    type: NEW_MESSAGE,
  };

  await notificationController.notifyUsers({
    user,
    type: NEW_MESSAGE,
    useSocket: true,
    event: "new_message_" + message.conversation,
    socketData: message,
    useFirebase: true,
    title: "New Message",
    body: `New message from ${username}`,
    useDatabase: true,
    notificationData,
  });
  await notificationController.notifyUsers({
    useSocket: true,
    event: "conversations_updated",
    socketData: conversation,
    user,
  });

  return message;
};

/**
 * @description read all messages
 * @param {String} conversation message id
 * @param {String} userTo user id
 * @returns {Object} message data
 */
export const readMessages = async (params: Partial<Message>): Promise<void> => {
  const { conversation, userTo } = params;
  const messageObj = { status: READ };
  if (!userTo) throw new Error("Please enter userTo id!|||400");
  if (!(await UserModel.exists({ _id: userTo })))
    throw new Error("Please enter valid userTo id!|||400");
  if (!conversation) throw new Error("Please enter conversation id!|||400");
  if (!(await ConversationModel.exists({ _id: conversation })))
    throw new Error("Please enter valid conversation id!|||400");
  await MessageModel.updateMany({ conversation, userTo }, messageObj);
};
