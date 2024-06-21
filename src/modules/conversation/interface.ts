// file imports
import { MongoID } from "../../configs/types";
import { Element } from "../element/interface";
import { MESSAGE_STATUSES } from "../../configs/enum";

export interface Conversation extends Element {
  userTo: MongoID;
  userFrom: MongoID;
  lastMessage?: MongoID;
  status?: MESSAGE_STATUSES;
}
