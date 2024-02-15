// module imports
import { isValidObjectId, Types } from "mongoose";

// file imports
import ElementModel from "./model";
import * as notificationController from "../notification/controller";
import * as conversationController from "../conversation/controller";
import * as userController from "../user/controller";
import { Element } from "./interface";
import { GetMessagesDTO, SendMessageDTO } from "./dto";
import { MESSAGE_STATUSES, NOTIFICATION_TYPES } from "../../configs/enum";

// destructuring assignments
const { NEW_MESSAGE } = NOTIFICATION_TYPES;
const { READ } = MESSAGE_STATUSES;
const { ObjectId } = Types;

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: Element) => {
  return await ElementModel.create(elementObj);
};

/**
 * @description Update element data
 * @param {String} element element id
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElementById = async (
  element: string,
  elementObj: Partial<Element>
) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await ElementModel.findByIdAndUpdate(
    element,
    elementObj,
    { new: true }
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
  const [result] = await ElementModel.aggregate([
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
    title: "New Element",
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
export const readMessages = async (params: Partial<Element>): Promise<void> => {
  const { conversation, userTo } = params;
  const messageObj = { status: READ };
  if (!userTo) throw new Error("Please enter userTo id!|||400");
  if (!(await userController.checkElementExistence({ _id: userTo })))
    throw new Error("Please enter valid userTo id!|||400");
  if (!conversation) throw new Error("Please enter conversation id!|||400");
  if (!(await conversationController.getElementById(conversation)))
    throw new Error("Please enter valid conversation id!|||400");
  await ElementModel.updateMany({ conversation, userTo }, messageObj);
};
