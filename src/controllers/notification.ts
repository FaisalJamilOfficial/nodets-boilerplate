// module imports
import { isValidObjectId } from "mongoose";

// file imports
import * as userController from "./user";
import FirebaseManager from "../utils/firebase-manager";
import SocketManager from "../utils/socket-manager";
import NotificationModel from "../models/notification";
import UserModel from "../models/user";
import { Notification } from "../interfaces/notification";
import { GetNotificationsDTO, NotifyUsersDTO } from "../dto/notification";
import { NOTIFICATION_STATUSES } from "../configs/enum";

// destructuring assignments
const { READ } = NOTIFICATION_STATUSES;

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: Notification) => {
  return await NotificationModel.create(elementObj);
};

/**
 * @description Update element data
 * @param {String} element element id
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElementById = async (
  element: string,
  elementObj: Partial<Notification>
) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element))
    throw new Error("Please enter valid element id!|||400");
  const elementExists = await NotificationModel.findByIdAndUpdate(
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
  query: Partial<Notification>,
  elementObj: Partial<Notification>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await NotificationModel.findOneAndUpdate(
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
  const elementExists = await NotificationModel.findByIdAndDelete(element);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} query element data
 * @returns {Object} element data
 */
export const deleteElement = async (query: Partial<Notification>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await NotificationModel.findOneAndDelete(query);
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
  const elementExists = await NotificationModel.findById(element).select(
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
export const getElement = async (query: Partial<Notification>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await NotificationModel.findOne(query).select(
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
export const getElements = async (params: GetNotificationsDTO) => {
  const { user } = params;
  let { page, limit } = params;
  const query: any = {};
  if (user) query.user = user;
  page = page - 1 || 0;
  limit = limit || 10;
  const [result] = await NotificationModel.aggregate([
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
        totalPages: {
          $ceil: {
            $divide: ["$totalCount.totalCount", limit],
          },
        },
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
export const checkElementExistence = async (query: Partial<Notification>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await NotificationModel.exists(query);
};

/**
 * @description Count elements
 * @param {Object} query element data
 * @returns {Number} elements count
 */
export const countElements = async (query: Partial<Notification>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await NotificationModel.countDocuments(query);
};

/**
 * @description notify users
 * @param {Object} params notify users parameters
 */
export const notifyUsers = async (params: NotifyUsersDTO): Promise<void> => {
  const {
    query,
    user,
    socketData,
    firebaseData,
    event,
    notificationData,
    title,
    body,
    type,
    isGrouped,
    useFirebase,
    useDatabase,
    useSocket,
  } = params;

  const fcms: any = [];

  if (isGrouped) {
    if (useFirebase) {
      const usersExist = await UserModel.find(query ?? {}).select("fcms");
      usersExist.forEach(async (element: any) => {
        element.fcms.forEach((e: any) => fcms.push(e.token));
      });
    }
    if (useSocket)
      // socket event emission
      await new SocketManager().emitGroupEvent({ event, data: socketData });
  } else {
    if (useFirebase) {
      const userExists = await userController.getElementById(user || "");
      userExists?.fcms.forEach((e: any) => fcms.push(e.token));
    }
    if (useSocket)
      // socket event emission
      await new SocketManager().emitEvent({
        to: user,
        event,
        data: socketData,
      });
  }
  if (useFirebase)
    // firebase notification emission
    await new FirebaseManager().multicast({
      fcms,
      title,
      body,
      data: firebaseData ? { ...firebaseData, type } : { type },
    });
  if (useDatabase)
    if (notificationData)
      // database notification creation
      await addElement(notificationData);
};

/**
 * @description read all notifications
 * @param {String} user user id
 */
export const readNotifications = async (user: string): Promise<void> => {
  const notificationObj = { status: READ };
  if (!user) throw new Error("Please enter user id!|||400");
  if (!(await userController.checkElementExistence({ _id: user })))
    throw new Error("Please enter valid user id!|||400");
  await NotificationModel.updateMany({ user }, notificationObj);
};
