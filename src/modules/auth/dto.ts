// file imports
import { USER_TYPES } from "../../configs/enum";

export type LoginDTO = {
  email: string;
  password: string;
  type: USER_TYPES;
};

export type SendEmailDTO = {
  email: string;
  name?: string;
};

export type GenerateEmailTokenDTO = {
  email: string;
  tokenExpirationTime: Date;
};

export type ResetPasswordDTO = {
  user: string;
  password: string;
  token: string;
};

export type VerifyUserEmailDTO = {
  user: string;
  token: string;
};
