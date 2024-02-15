// file imports
import { GetElementsDTO } from "../element/dto";

export interface GetConversationsDTO extends GetElementsDTO {
  user: string;
}
