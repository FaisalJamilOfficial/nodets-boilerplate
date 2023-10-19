// file imports
import { NOTIFICATION_TYPES } from "../configs/enums";
import { Notification } from "../interfaces/notifications";

export type GetNotificationsDTO = {
  limit: number;
  page: number;
  user: string;
};
export type NotifyUsersDTO = {
  query?: Object;
  user?: string;
  socketData?: Object;
  firebaseData?: Object;
  event?: string;
  notificationData?: Notification;
  title?: string;
  body?: string;
  type?: NOTIFICATION_TYPES;
  isGrouped?: boolean;
  useFirebase?: boolean;
  useDatabase?: boolean;
  useSocket?: boolean;
};
