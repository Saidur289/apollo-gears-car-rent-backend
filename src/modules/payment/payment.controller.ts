import status from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../utils/sendResponse";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  // Implementation will be in the service layer
  const payload = req.body;
  const result = await PaymentService.createPaymentIntent(payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment intent created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  // Implementation will be in the service layer
  const { rentId, transactionId } = req.body;

  const result = await PaymentService.confirmPayment(rentId, transactionId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
  confirmPayment,
};
