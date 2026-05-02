import { Router } from "express";
import auth from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/create-payment-intent",
  auth("USER"),
  PaymentController.createPaymentIntent,
);
router.post(
  "/confirm-payment",
  auth(Role.USER),
  PaymentController.confirmPayment,
);
export const PaymentRoute = router;
