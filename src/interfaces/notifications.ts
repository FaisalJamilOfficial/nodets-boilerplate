export interface Notification {
  _id?: string;
  type: string;
  user: string;
  message?: string;
  messenger?: string;
}
