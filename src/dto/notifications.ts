// file imports
import { Notification } from "../interfaces";

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
  type?: string;
  isGrouped?: boolean;
  useFirebase?: boolean;
  useDatabase?: boolean;
  useSocket?: boolean;
};
