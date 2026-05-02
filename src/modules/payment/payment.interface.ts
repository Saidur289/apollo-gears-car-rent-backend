export type TPaymentResult = {
  clientSecret: string;
  amount: number;
  transactionId?: string;
};
export type TPaymentConfirmation = {
  transactionId: string;
  rentId: string;
  amount: number;
  status: string;
  gatewayData?: any;
};
export type TPaymentIntent = {
  rentId: string;
};
