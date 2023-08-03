export interface Message {
  _id?: string;
  conversation: string;
  userTo: string;
  userFrom: string;
  text?: string;
  attachments?: { path: string; type: string }[];
}
