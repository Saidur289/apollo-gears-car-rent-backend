import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BidService } from "./bid.service";
import { AuthenticatedRequest } from "../../middlewares/auth";

const createBid = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as AuthenticatedRequest).user.id;
  const bid = await BidService.createBid(req.body, driverId);
  sendResponse(res, httpStatus.CREATED, true, "Bid placed successfully", bid);
});

const getBidsByRent = catchAsync(async (req: Request, res: Response) => {
  const { rentId } = req.params;
  const bids = await BidService.getBidsByRent(rentId as string);
  sendResponse(res, httpStatus.OK, true, "Bids retrieved successfully", bids);
});

const getBidById = catchAsync(async (req: Request, res: Response) => {
  const bid = await BidService.getBidById(req.params.id as string);
  sendResponse(res, httpStatus.OK, true, "Bid retrieved successfully", bid);
});

const acceptBid = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const bid = await BidService.acceptBid(req.params.id as string, userId);
  sendResponse(res, httpStatus.OK, true, "Bid accepted successfully", bid);
});

const rejectBid = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const bid = await BidService.rejectBid(req.params.id as string, userId);
  sendResponse(res, httpStatus.OK, true, "Bid rejected successfully", bid);
});

const deleteBid = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as AuthenticatedRequest).user.id;
  await BidService.deleteBid(req.params.id as string, driverId);
  sendResponse(res, httpStatus.OK, true, "Bid deleted successfully", null);
});

export const BidController = {
  createBid,
  getBidsByRent,
  getBidById,
  acceptBid,
  rejectBid,
  deleteBid,
};
