// file imports
import { User } from "../interfaces/user";

export type GetUsersDTO = {
  limit: number;
  page: number;
  type?: string;
  user: string;
  keyword: string;
};
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
