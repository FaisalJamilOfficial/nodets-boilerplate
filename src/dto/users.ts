export type GetUsersDTO = {
  limit: number;
  page: number;
  type?: string;
  user: string;
  keyword: string;
};

export type updateUserDTO = {
  email?: string;
  password?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  image?: string;
  fcm?: { token: string; device: string };
  coordinates?: number[];
  type?: string;
  status?: string;
  isOnline?: boolean;
  customer?: string;
  admin?: string;
  googleID?: string;
  facebookID?: string;
  twitterID?: string;
  shallRemoveFCM?: boolean;
  device?: string;
};

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
