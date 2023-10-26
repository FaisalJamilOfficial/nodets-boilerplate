// file imports
import { MESSAGE_STATUSES } from "../configs/enum";
export interface Conversation {
  _id?: string;
  userTo: string;
  userFrom: string;
  lastMessage?: string;
  status?: MESSAGE_STATUSES;
}
