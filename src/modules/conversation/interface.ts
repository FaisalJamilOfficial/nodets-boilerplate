// file imports
import { MongoID } from "../../configs/types";
import { MESSAGE_STATUSES } from "../../configs/enum";

export interface Element {
  _id?: MongoID;
  userTo: MongoID;
  userFrom: MongoID;
  lastMessage?: MongoID;
  status?: MESSAGE_STATUSES;
}
