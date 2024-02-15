// file imports
import { MESSAGE_STATUSES } from "../../configs/enum";
export interface Element {
  _id?: string;
  userTo: string;
  userFrom: string;
  lastMessage?: string;
  status?: MESSAGE_STATUSES;
}
