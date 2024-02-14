// file imports
import { NOTIFICATION_TYPES } from "../../configs/enum";
import { Notification } from "./interface";
import { GetElementsDTO } from "../element/dto";

export interface GetNotificationsDTO extends GetElementsDTO {
  user: string;
}

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
