// file imports
import { Message } from "../interfaces/message";

export type GetMessagesDTO = {
  limit: number;
  page: number;
  conversation: string;
  user1: string;
  user2: string;
};

export type GetConversationsDTO = {
  limit: number;
  page: number;
  user: string;
  keyword: string;
};

export interface SendMessageDTO extends Message {
  username: string;
}
