// file imports
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
 * Add notification
 * @param {Object} notificationObj notification data
 * @returns {Object} notification data
 */
export const addNotification = async (notificationObj: Notification) => {
  return await NotificationModel.create(notificationObj);
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
      const userExists = await UserModel.findById(user).select("fcms");
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
      await addNotification(notificationData);
};

/**
 * @description read all notifications
 * @param {String} user user id
 */
export const readNotifications = async (user: string): Promise<void> => {
  const notificationObj = { status: READ };
  if (!user) throw new Error("Please enter user id!|||400");
  if (!(await UserModel.exists({ _id: user })))
    throw new Error("Please enter valid user id!|||400");
  await NotificationModel.updateMany({ user }, notificationObj);
};
