// file imports
import { GetElementsDTO } from "./element";

export interface GetPaymentAccountDTO {
  paymentAccount: string;
  user: string;
  key: string;
  value: string;
}

export interface GetPaymentAccountsDTO extends GetElementsDTO {
  user: string;
}
