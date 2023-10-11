export interface GetPaymentAccountDTO {
  paymentAccount: string;
  user: string;
  key: string;
  value: string;
}

export interface GetPaymentAccountsDTO {
  limit: number;
  page: number;
  user: string;
}
