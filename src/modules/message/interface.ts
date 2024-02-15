// file imports
import { MESSAGE_STATUSES } from "../../configs/enum";

export interface Element {
  _id?: string;
  conversation: string;
  userTo: string;
  userFrom: string;
  text?: string;
  status?: MESSAGE_STATUSES;
  attachments?: { path: string; type: string }[];
}
