// file imports
import { USER_STATUSES, USER_TYPES } from "../../configs/enum";

export interface User {
  _id?: string;
  email: string;
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  image?: string;
  fcms?: { token: string; device: string }[];
  location?: { type?: string; coordinates?: number[] };
  type: USER_TYPES;
  status?: USER_STATUSES;
  isOnline?: boolean;
  customer?: string;
  admin?: string;
  googleID?: string;
  facebookID?: string;
  twitterID?: string;
}
