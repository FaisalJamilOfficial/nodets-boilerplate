// file imports
import { MongoID } from "../../configs/types";
import { Element } from "../element/interface";
import { NOTIFICATION_TYPES } from "../../configs/enum";

export interface Notification extends Element {
  type: NOTIFICATION_TYPES;
  user: MongoID;
  message?: MongoID;
  messenger?: MongoID;
}
