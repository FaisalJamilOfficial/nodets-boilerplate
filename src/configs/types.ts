// module imports
import { Request } from "express";

export type IRequest = Request & {
  user: any;
  files: object[];
  file: object;
  io: object;
};
