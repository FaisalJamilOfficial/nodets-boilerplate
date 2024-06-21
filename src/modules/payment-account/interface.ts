// file imports
import { MongoID } from "../../configs/types";
import { Element } from "../element/interface";
import { PAYMENT_ACCOUNT_TYPES } from "../../configs/enum";

export interface PaymentAccount extends Element {
  type: PAYMENT_ACCOUNT_TYPES;
  user: MongoID;
  account?: object;
}
