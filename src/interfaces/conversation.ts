export interface Conversation {
  _id?: string;
  userTo: string;
  userFrom: string;
  lastMessage?: string;
  status?: string;
}
