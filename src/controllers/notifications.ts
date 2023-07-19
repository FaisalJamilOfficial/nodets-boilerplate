// file imports
import FirebaseManager from "../utils/firebase-manager";
import SocketManager from "../utils/socket-manager";
import models from "../models";
import { NOTIFICATION_STATUSES } from "../configs/enums";

// destructuring assignments
const { notificationsModel, usersModel } = models;
const { READ } = NOTIFICATION_STATUSES;

/**
 * Add notification
 * @param {String} user user id
 * @param {String} type type
 * @param {String} message message id
 * @param {String} messenger messenger id
 * @returns {Object} notification data
 */
export const addNotification = async (params: any) => {
  const { user, type, message, messenger } = params;
  const notificationObj: any = {};

  if (user) notificationObj.user = user;
  if (type) notificationObj.type = type;
  if (message) notificationObj.message = message;
  if (messenger) notificationObj.messenger = messenger;

  return await notificationsModel.create(notificationObj);
};

/**
 * @description Get notifications
 * @param {String} user user id
 * @param {Number} limit notifications limit
 * @param {Number} page notifications page number
 * @returns {[Object]} array of notifications
 */
export const getNotifications = async (params: any) => {
  const { user } = params;
  let { page, limit } = params;
  const query: any = {};
  if (user) query.user = user;
  if (!limit) limit = 10;
  if (!page) page = 0;
  if (page) page = page - 1;
  const notifications = await notificationsModel.aggregate([
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
  return { data: [], totalCount: 0, totalPages: 0, ...notifications[0] };
};

/**
 * @description notify users
 * @param {Object} query users model query
 * @param {String} user user id
 * @param {Object} socketData socket event data
 * @param {Object} firebaseData firebase notification data
 * @param {Object} notificationData notifications model data
 * @param {String} event socket event name
 * @param {String} type notification type
 * @param {String} title notification title
 * @param {String} body notification body
 * @param {Boolean} isGrouped notifications multicasting check
 * @param {Boolean} useFirebase firebase usage check
 * @param {Boolean} useDatabase database usage check
 * @param {Boolean} useSocket socket usage check
 * @returns {null} null
 */
export const notifyUsers = async (params: any) => {
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
  const data = { type };

  if (isGrouped) {
    if (useFirebase) {
      const usersExist = await usersModel.find(query ?? {}).select("fcms");
      usersExist.forEach(async (element: any) => {
        element.fcms.forEach((e: any) => fcms.push(e.token));
      });
    }
    if (useSocket)
      // socket event emission
      await new SocketManager().emitGroupEvent({
        event,
        data: socketData,
      });
  } else {
    if (useFirebase) {
      const userExists = await usersModel.findById(user).select("fcms");
      userExists?.fcms.forEach((e: any) => fcms.push(e.token));
    }
    if (useSocket)
      // socket event emission
      await new SocketManager().emitEvent({
        to: user.toString(),
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
      data: firebaseData ? { ...firebaseData, ...data } : data,
    });
  if (useDatabase)
    if (notificationData)
      // database notification creation
      await addNotification({ ...notificationData, ...data });
};

/**
 * @description read all notifications
 * @param {String} user user id
 * @returns {Object} notification data
 */
export const readNotifications = async (params: any) => {
  const { user } = params;
  const notificationObj = { status: READ };
  if (!user) throw new Error("Please enter user id!|||400");
  if (!(await usersModel.exists({ _id: user })))
    throw new Error("Please enter valid user id!|||400");
  await notificationsModel.updateMany({ user }, notificationObj);
};
