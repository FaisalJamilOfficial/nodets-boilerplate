// file imports
import { MongoID } from "../../configs/types";
import { Element } from "../element/interface";

export interface Profile extends Element {
  user: MongoID;
}
