// file imports
import { PAYMENT_ACCOUNT_TYPES } from "../configs/enums";
export interface PaymentAccount {
  _id?: string;
  type: PAYMENT_ACCOUNT_TYPES;
  user: string;
  account: any;
}
