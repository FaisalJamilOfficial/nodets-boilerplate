// file imports
import { Element } from "./interface";
import { MongoID } from "../../configs/types";
import { GetElementsDTO } from "../element/dto";

export interface GetMessagesDTO extends GetElementsDTO {
  conversation: MongoID;
  user1: MongoID;
  user2: MongoID;
}

export interface SendMessageDTO extends Element {
  username: string;
}
