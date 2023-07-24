export interface Message {
  conversation: string;
  userTo: string;
  userFrom: string;
  text?: string;
  attachments?: { path: string; type: string }[];
}
