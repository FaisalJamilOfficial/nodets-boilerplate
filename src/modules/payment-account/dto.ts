// file imports
import { MongoID } from "../../configs/types";
import { GetElementsDTO } from "../element/dto";

export type GetPaymentAccountDTO = {
  paymentAccount: MongoID;
  user: MongoID;
  key: string;
  value: string;
};

export interface GetPaymentAccountsDTO extends GetElementsDTO {
  user: MongoID;
}
