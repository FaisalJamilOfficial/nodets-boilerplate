// file imports
import { GetElementsDTO } from "./element";

export type GetPaymentAccountDTO = {
  paymentAccount: string;
  user: string;
  key: string;
  value: string;
};

export interface GetPaymentAccountsDTO extends GetElementsDTO {
  user: string;
}
