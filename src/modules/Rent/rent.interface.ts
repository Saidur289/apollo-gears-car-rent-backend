import { RentStatus } from '../../../generated/prisma/enums';

export type TCreateRent = {
  startingPoint: string;
  destination: string;
  carId: string;
};

export type TUpdateRent = {
  status?: RentStatus;
};

export type TRentQuery = {
  page?: number;
  limit?: number;
  status?: RentStatus;
  sortBy?: keyof TCreateRent | 'status' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};