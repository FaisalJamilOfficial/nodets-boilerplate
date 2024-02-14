// file imports
import { User } from "./interface";
import { GetElementsDTO } from "../element/dto";

export interface GetUsersDTO extends GetElementsDTO {
  type?: string;
  user: string;
}
export interface updateUserDTO extends Partial<User> {
  fcm?: { token: string; device: string };
  coordinates?: number[];
  device?: string;
  shallRemoveFCM?: boolean;
}

export type getUserDTO = {
  user?: string;
  email?: string;
  phone?: string;
  googleId?: string;
  facebookId?: string;
  twitterId?: string;
};

export type getUserProfileDTO = {
  user: string;
  device: string;
};
