// file imports
import { PAYMENT_ACCOUNT_TYPES } from "../../configs/enum";

export interface Element {
  _id?: string;
  type: PAYMENT_ACCOUNT_TYPES;
  user: string;
  account: any;
}
