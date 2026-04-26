import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { TCreateCar, TUpdateCar } from "./car.interface";

const createCar = async (payload: TCreateCar) => {
  return prisma.car.create({
    data: {
      ...payload,
      rating: payload.rating ?? 0,
    },
  });
};

const getCars = async () => {
  return prisma.car.findMany({
    where: {
      isDeleted: false,
    },
  });
};

const getCarById = async (id: string) => {
  const car = await prisma.car.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  return car;
};

const updateCar = async (id: string, payload: TUpdateCar) => {
  const existingCar = await prisma.car.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existingCar) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  return prisma.car.update({
    where: { id },
    data: payload,
  });
};

const deleteCar = async (id: string) => {
  const existingCar = await prisma.car.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existingCar) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  return prisma.car.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const CarService = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};
