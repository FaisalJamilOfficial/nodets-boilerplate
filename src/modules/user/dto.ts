// file imports
import { MongoID } from "../../configs/types";
import { User } from "./interface";
import { GetElementsDTO } from "../element/dto";

export interface GetUsersDTO extends GetElementsDTO {
  type?: string;
  user: MongoID;
}
export interface updateUserDTO extends Partial<User> {
  coordinates?: number[];
  device?: string;
  shallRemoveFCM?: boolean;
}

export type getUserDTO = {
  user?: MongoID;
  email?: string;
  phone?: string;
  googleId?: string;
  facebookId?: string;
  appleId?: string;
  selection?: string;
};

export type getUserProfileDTO = {
  user: MongoID;
  device: string;
};
