// file imports
import { MongoID } from "../../configs/types";
import { NOTIFICATION_TYPES } from "../../configs/enum";
import { Notification } from "./interface";
import { Message } from "../message/interface";
import { Conversation } from "../conversation/interface";
import { GetElementsDTO } from "../element/dto";

export interface GetNotificationsDTO extends GetElementsDTO {
  user: MongoID;
}

export type NotifyUsersDTO = {
  query?: Object;
  user?: MongoID;
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
  fcmArray?: string[];
};

export type sendNotificationsDTO = {
  username: string;
  notificationData: Notification;
  conversationData?: Conversation;
  messageData?: Message;
  query?: Object;
};
