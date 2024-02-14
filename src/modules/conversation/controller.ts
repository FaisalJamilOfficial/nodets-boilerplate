// module imports
import { isValidObjectId } from "mongoose";

// file imports
import ConversationModel from "./model";
import { Conversation } from "./interface";
import { GetConversationsDTO } from "../message/dto";
import { CONVERSATION_STATUSES } from "../../configs/enum";

// destructuring assignments
const { PENDING, ACCEPTED, REJECTED } = CONVERSATION_STATUSES;

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: Conversation) => {
  const { userFrom, userTo } = elementObj;
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
 * @description Update element data
 * @param {String} element element id
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElementById = async (
  element: string,
  elementObj: Partial<Conversation>
) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await ConversationModel.findByIdAndUpdate(
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
  query: Partial<Conversation>,
  elementObj: Partial<Conversation>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ConversationModel.findOneAndUpdate(
    query,
    elementObj,
    {
      new: true,
    }
  );
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
  const elementExists = await ConversationModel.findByIdAndDelete(element);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} query element data
 * @returns {Object} element data
 */
export const deleteElement = async (query: Partial<Conversation>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ConversationModel.findOneAndDelete(query);
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
  const elementExists = await ConversationModel.findById(element).select(
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
export const getElement = async (query: Partial<Conversation>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ConversationModel.findOne(query).select(
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
export const getElements = async (params: GetConversationsDTO) => {
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
 * @description Check element existence
 * @param {Object} query element data
 * @returns {Boolean} element existence status
 */
export const checkElementExistence = async (query: Partial<Conversation>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await ConversationModel.exists(query);
};

/**
 * @description Count elements
 * @param {Object} query element data
 * @returns {Number} elements count
 */
export const countElements = async (query: Partial<Conversation>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await ConversationModel.countDocuments(query);
};
