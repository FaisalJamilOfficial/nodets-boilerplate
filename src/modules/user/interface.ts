// file imports
import { MongoID } from "../../configs/types";
import { Element } from "../element/interface";
import { USER_STATUSES, USER_TYPES } from "../../configs/enum";

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
  status?: USER_STATUSES;
  isOnline?: boolean;
  profile?: MongoID;
  googleId?: string;
  facebookId?: string;
  lastLogin?: Date;
  otp?: string;
}
