// file imports
import { MongoID } from "../../configs/types";
import { NOTIFICATION_TYPES } from "../../configs/enum";
import { Element } from "./interface";
import { Element as Message } from "../message/interface";
import { Element as Conversation } from "../conversation/interface";
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
  notificationData?: Element;
  title?: string;
  body?: string;
  type?: NOTIFICATION_TYPES;
  isGrouped?: boolean;
  useFirebase?: boolean;
  useDatabase?: boolean;
  useSocket?: boolean;
};

export type sendNotificationsDTO = {
  username: string;
  notificationData: Element;
  conversationData?: Conversation;
  messageData?: Message;
  query?: Object;
};
