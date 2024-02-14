// file imports
import { Message } from "./interface";
import { GetElementsDTO } from "../element/dto";

export interface GetMessagesDTO extends GetElementsDTO {
  conversation: string;
  user1: string;
  user2: string;
}

export interface GetConversationsDTO extends GetElementsDTO {
  user: string;
}

export interface SendMessageDTO extends Message {
  username: string;
}
