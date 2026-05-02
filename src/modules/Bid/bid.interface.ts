import { BidStatus } from '../../../generated/prisma/enums';

export type TCreateBid = {
  amount: number;
  driverLocation: string;
  rentId: string;
};

export type TUpdateBidStatus = {
  status: BidStatus;
};