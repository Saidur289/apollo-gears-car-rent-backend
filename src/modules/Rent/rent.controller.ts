import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RentService } from "./rent.service";
import { AuthenticatedRequest } from "../../middlewares/auth";

const createRent = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const rent = await RentService.createRent(req.body, userId);
  sendResponse(
    res,
    httpStatus.CREATED,
    true,
    "Rent created successfully",
    rent,
  );
});

const getRents = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const result = await RentService.getRents(req.query as any, userId);
  sendResponse(
    res,
    httpStatus.OK,
    true,
    "Rents retrieved successfully",
    result.data,
    result.meta,
  );
});

const getRentById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const rent = await RentService.getRentById(req.params.id as string, userId);
  sendResponse(res, httpStatus.OK, true, "Rent retrieved successfully", rent);
});

const updateRent = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const rent = await RentService.updateRent(
    req.params.id as string,
    req.body,
    userId,
  );
  sendResponse(res, httpStatus.OK, true, "Rent updated successfully", rent);
});

const deleteRent = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const rent = await RentService.deleteRent(req.params.id as string, userId);
  sendResponse(res, httpStatus.OK, true, "Rent deleted successfully", rent);
});

export const RentController = {
  createRent,
  getRents,
  getRentById,
  updateRent,
  deleteRent,
};
