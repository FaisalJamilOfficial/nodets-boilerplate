// file imports
import { NOTIFICATION_TYPES } from "../configs/enums";
export interface Notification {
  _id?: string;
  type: NOTIFICATION_TYPES;
  user: string;
  message?: string;
  messenger?: string;
}
