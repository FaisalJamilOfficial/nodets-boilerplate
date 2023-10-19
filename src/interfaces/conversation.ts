// file imports
import { MESSAGE_STATUSES } from "../configs/enums";
export interface Conversation {
  _id?: string;
  userTo: string;
  userFrom: string;
  lastMessage?: string;
  status?: MESSAGE_STATUSES;
}
