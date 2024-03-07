// file imports
import { MongoID } from "../../configs/types";

export interface UserToken {
  _id?: MongoID;
  user: MongoID;
  token?: string;
}
