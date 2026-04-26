import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CarService } from "./car.service";

const createCar = catchAsync(async (req: Request, res: Response) => {
  const car = await CarService.createCar(req.body);
  sendResponse(res, httpStatus.CREATED, true, "Car created successfully", car);
});

const getCars = catchAsync(async (req: Request, res: Response) => {
  const cars = await CarService.getCars();
  sendResponse(res, httpStatus.OK, true, "Cars retrieved successfully", cars);
});

const getCarById = catchAsync(async (req: Request, res: Response) => {
  const car = await CarService.getCarById(req.params.id as string);
  sendResponse(res, httpStatus.OK, true, "Car retrieved successfully", car);
});

const updateCar = catchAsync(async (req: Request, res: Response) => {
  const car = await CarService.updateCar(req.params.id as string, req.body);
  sendResponse(res, httpStatus.OK, true, "Car updated successfully", car);
});

const deleteCar = catchAsync(async (req: Request, res: Response) => {
  const car = await CarService.deleteCar(req.params.id as string);
  sendResponse(res, httpStatus.OK, true, "Car deleted successfully", car);
});

export const CarController = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};
