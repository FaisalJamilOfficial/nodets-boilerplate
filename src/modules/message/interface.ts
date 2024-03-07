// file imports
import { MongoID } from "../../configs/types";
import { MESSAGE_STATUSES } from "../../configs/enum";

export interface Element {
  _id?: MongoID;
  conversation: MongoID;
  userTo: MongoID;
  userFrom: MongoID;
  text?: string;
  status?: MESSAGE_STATUSES;
  attachments?: { path: string; type: string }[];
}
