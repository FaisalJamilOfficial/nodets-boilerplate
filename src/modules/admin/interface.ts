// file imports
import { MongoID } from "../../configs/types";
import { ACCOUNT_STATUSES, ADMIN_TYPES } from "../../configs/enum";

export interface Admin {
  _id?: MongoID;
  email: string;
  password: string;
  type: ADMIN_TYPES;
  status?: ACCOUNT_STATUSES;
  lastLogin?: Date;
  getSignedjwtToken?: () => string;
  setPassword?: (password: string) => null;
  validatePassword?: (password: string) => Promise<boolean>;
}
