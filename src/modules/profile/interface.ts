// file imports
import { MongoID } from "../../configs/types";

export interface Element {
  _id?: MongoID;
  user: MongoID;
}
