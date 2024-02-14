// module imports
import { isValidObjectId, Types } from "mongoose";

// file imports
import * as notificationController from "./notification";
import * as conversationController from "./conversation";
import * as userController from "./user";
import MessageModel from "../models/message";
import { Message } from "../interfaces/message";
import { GetMessagesDTO, SendMessageDTO } from "../dto/message";
import { MESSAGE_STATUSES, NOTIFICATION_TYPES } from "../configs/enum";

// destructuring assignments
const { NEW_MESSAGE } = NOTIFICATION_TYPES;
const { READ } = MESSAGE_STATUSES;
const { ObjectId } = Types;

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: Message) => {
  return await MessageModel.create(elementObj);
};

/**
 * @description Update element data
 * @param {String} element element id
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElementById = async (
  element: string,
  elementObj: Partial<Message>
) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await MessageModel.findByIdAndUpdate(
    element,
    elementObj,
    { new: true }
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Update element data
 * @param {Object} query element data
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElement = async (
  query: Partial<Message>,
  elementObj: Partial<Message>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await MessageModel.findOneAndUpdate(query, elementObj, {
    new: true,
  });
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const deleteElementById = async (element: string) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await MessageModel.findByIdAndDelete(element);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} query element data
 * @returns {Object} element data
 */
export const deleteElement = async (query: Partial<Message>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await MessageModel.findOneAndDelete(query);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const getElementById = async (element: string) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await MessageModel.findById(element).select(
    "-createdAt -updatedAt -__v"
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get element
 * @param {Object} query element data
 * @returns {Object} element data
 */
export const getElement = async (query: Partial<Message>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await MessageModel.findOne(query).select(
    "-createdAt -updatedAt -__v"
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get elements
 * @param {Object} params elements fetching parameters
 * @returns {Object[]} elements data
 */
export const getElements = async (params: GetMessagesDTO) => {
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
 * @description Check element existence
 * @param {Object} query element data
 * @returns {Boolean} element existence status
 */
export const checkElementExistence = async (query: Partial<Message>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await MessageModel.exists(query);
};

/**
 * @description Count elements
 * @param {Object} query element data
 * @returns {Number} elements count
 */
export const countElements = async (query: Partial<Message>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await MessageModel.countDocuments(query);
};

/**
 * @description Send message
 * @param {Object} params send message data
 * @returns {Object} message data
 */
export const send = async (params: SendMessageDTO) => {
  const { username } = params;

  const conversation = await conversationController.addElement(params);

  const message = await addElement({
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
 * @param {Object} params read messages data
 */
export const readMessages = async (params: Partial<Message>): Promise<void> => {
  const { conversation, userTo } = params;
  const messageObj = { status: READ };
  if (!userTo) throw new Error("Please enter userTo id!|||400");
  if (!(await userController.checkElementExistence({ _id: userTo })))
    throw new Error("Please enter valid userTo id!|||400");
  if (!conversation) throw new Error("Please enter conversation id!|||400");
  if (!(await conversationController.getElementById(conversation)))
    throw new Error("Please enter valid conversation id!|||400");
  await MessageModel.updateMany({ conversation, userTo }, messageObj);
};
