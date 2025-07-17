// file imports
import { MongoID } from "../../configs/types";
import { Element } from "../element/interface";
import { MESSAGE_STATUSES } from "../../configs/enum";

export interface Message extends Element {
  conversation: MongoID;
  userTo: MongoID;
  userFrom: MongoID;
  text?: string;
  status?: MESSAGE_STATUSES;
  attachments?: { key: string; type: string }[];
}
