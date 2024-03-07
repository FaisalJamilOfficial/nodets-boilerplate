// file imports
import { MongoID } from "../../configs/types";
import { NOTIFICATION_TYPES } from "../../configs/enum";

export interface Element {
  _id?: MongoID;
  type: NOTIFICATION_TYPES;
  user: MongoID;
  message?: MongoID;
  messenger?: MongoID;
}
