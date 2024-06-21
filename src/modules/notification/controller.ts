// module imports

// file imports
import FirebaseManager from "../../utils/firebase-manager";
import SocketManager from "../../utils/socket-manager";
import NotificationModel from "./model";
import * as userController from "../user/controller";
import { Notification } from "./interface";
import { MongoID } from "../../configs/types";
import { ErrorHandler } from "../../middlewares/error-handler";
import {
  GetNotificationsDTO,
  NotifyUsersDTO,
  sendNotificationsDTO,
} from "./dto";
import {
  NOTIFICATION_STATUSES,
  NOTIFICATION_TYPES,
  SOCKET_EVENTS,
} from "../../configs/enum";

// destructuring assignments
const { READ } = NOTIFICATION_STATUSES;
const { NEW_MESSAGE_, CONVERSATIONS_UPDATED } = SOCKET_EVENTS;
const { NEW_MESSAGE } = NOTIFICATION_TYPES;

/**
 * @description Add notification
 * @param {Object} notificationObj notification data
 * @returns {Object} notification data
 */
export const addNotification = async (notificationObj: Notification) => {
  return await NotificationModel.create(notificationObj);
};

/**
 * @description Add notifications
 * @param {Object[]} notifications notifications data
 * @returns {Object} notification data
 */
export const addNotifications = async (notifications: Notification[]) => {
  return await NotificationModel.create(notifications);
};

/**
 * @description Get notifications
 * @param {Object} params notifications fetching parameters
 * @returns {Object[]} notifications data
 */
export const getNotifications = async (params: GetNotificationsDTO) => {
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
  let usersExist: any = [];

  if (isGrouped) {
    if (useFirebase) {
      const queryObj: any = query ?? {};
      queryObj.limit = Math.pow(2, 32);
      const { data } = await userController.getUsers(queryObj);
      usersExist = data;
      usersExist.forEach(async (notification: any) => {
        notification.fcms.forEach((e: any) => fcms.push(e.token));
      });
    }
    if (useSocket)
      // socket event emission
      await new SocketManager().emitGroupEvent({ event, data: socketData });
  } else {
    if (useFirebase) {
      const userExists = await userController.getUserById(user || "");
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
    if (notificationData) {
      // database notification creation
      if (type) notificationData.type = type;
      if (isGrouped) {
        const notifications = usersExist?.map((notification: any) => {
          return { ...notificationData, user: notification._id };
        });
        await addNotifications(notifications);
      } else await addNotification(notificationData);
    }
};

/**
 * @description read all notifications
 * @param {String} user user id
 */
export const readNotifications = async (user: MongoID): Promise<void> => {
  const notificationObj = { status: READ };
  if (!user) throw new ErrorHandler("Please enter user id!", 400);
  if (!(await userController.checkUserExistence({ _id: user })))
    throw new ErrorHandler("Please enter valid user id!", 400);
  await NotificationModel.updateMany({ user }, notificationObj);
};

/**
 * @description send new message notification
 * @param {Object} params notification parameters
 */
export const sendNewMessageNotification = async (
  params: sendNotificationsDTO
): Promise<void> => {
  const { username, notificationData, conversationData, messageData } = params;
  await notifyUsers({
    user: notificationData.user,
    type: NEW_MESSAGE,
    useSocket: true,
    event: NEW_MESSAGE_ + messageData?.conversation,
    socketData: messageData,
    useFirebase: true,
    title: "New Message",
    body: `New message from ${username}`,
    useDatabase: true,
    notificationData,
  });
  await notifyUsers({
    useSocket: true,
    event: CONVERSATIONS_UPDATED,
    socketData: conversationData,
    user: notificationData.user,
  });
};
