// file imports
import { MongoID } from "../../configs/types";
import { Element } from "../element/interface";
import { ACCOUNT_STATUSES, USER_TYPES } from "../../configs/enum";

export interface User extends Element {
  _id?: MongoID;
  email: string;
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  image?: string;
  fcm?: string;
  device?: string;
  location?: { type?: string; coordinates?: number[] };
  type: USER_TYPES;
  status?: ACCOUNT_STATUSES;
  isOnline?: boolean;
  isDeleted?: boolean;
  isPasswordSet?: boolean;
  profile?: MongoID;
  googleId?: string;
  facebookId?: string;
  lastLogin?: Date;
  lastUsed?: Date;
  otp?: string;
  getSignedjwtToken?: () => string;
  setPassword?: (password: string) => null;
  validatePassword?: (password: string) => Promise<boolean>;
  populate?: (field: string) => Promise<User>;
}
