// file imports
import { Element } from "./interface";
import { GetElementsDTO } from "../element/dto";

export interface GetMessagesDTO extends GetElementsDTO {
  conversation: string;
  user1: string;
  user2: string;
}

export interface SendMessageDTO extends Element {
  username: string;
}
