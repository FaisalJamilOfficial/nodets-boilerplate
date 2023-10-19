// file imports
import { MESSAGE_STATUSES } from "../configs/enums";
export interface Message {
  _id?: string;
  conversation: string;
  userTo: string;
  userFrom: string;
  text?: string;
  status?: MESSAGE_STATUSES;
  attachments?: { path: string; type: string }[];
}
