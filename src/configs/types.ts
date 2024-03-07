// module imports
import { Request } from "express";
import { Types } from "mongoose";

// file imports
import { Element as User } from "../modules/user/interface";

export type MongoID = Types.ObjectId | string;

export type IRequest = Request & {
  user: { _id: MongoID } & User;
  files: object[];
  file: object;
  io: object;
};
