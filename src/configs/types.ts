// module imports
import { Request } from "express";
import { Types } from "mongoose";
import { Server } from "socket.io";

// file imports
import { User } from "../modules/user/interface";

export type MongoID = Types.ObjectId | string;

export type IRequest = Request & {
  user: { _id: MongoID } & User;
  files: Express.Multer.File[]; // Express.MulterS3.File[];
  file: Express.Multer.File; // Express.MulterS3.File;
  io: Server;
};
