// module imports
import { Request } from "express";

export type IRequest = Request & {
  user: any;
  files: any;
  file: any;
  io: object;
};
