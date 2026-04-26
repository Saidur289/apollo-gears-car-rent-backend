import { Condition, FuelType } from "../../../generated/prisma/enums";

export type TCreateCar = {
  name: string;
  brand: string;
  model: string;
  image?: string;
  fuelType: FuelType;
  passengerCapacity: number;
  color: string;
  condition: Condition;
  rating?: number;
};

export type TUpdateCar = Partial<TCreateCar>;
