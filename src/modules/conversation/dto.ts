// file imports
import { MongoID } from "../../configs/types";
import { GetElementsDTO } from "../element/dto";

export interface GetConversationsDTO extends GetElementsDTO {
  user: MongoID;
}
