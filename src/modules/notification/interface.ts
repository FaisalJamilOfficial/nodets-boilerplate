// file imports
import { NOTIFICATION_TYPES } from "../../configs/enum";

export interface Element {
  _id?: string;
  type: NOTIFICATION_TYPES;
  user: string;
  message?: string;
  messenger?: string;
}
