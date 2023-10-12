export interface User {
  _id?: string;
  email: string;
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  image?: string;
  fcms?: { token: string; device: string }[];
  coordinates?: number[];
  type: string;
  status?: string;
  isOnline?: boolean;
  customer?: string;
  admin?: string;
  googleID?: string;
  facebookID?: string;
  twitterID?: string;
}
