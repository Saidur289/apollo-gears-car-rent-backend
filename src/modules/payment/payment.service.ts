import Stripe from "stripe";
import config from "../../config";
import {
  TPaymentConfirmation,
  TPaymentIntent,
  TPaymentResult,
} from "./payment.interface";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";
import e from "express";

const stripe = new Stripe(config.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});
const createPaymentIntent = async (
  payload: TPaymentIntent,
): Promise<TPaymentResult> => {
  const { rentId } = payload;
  const rent = await prisma.rent.findUnique({
    where: { id: rentId },
    include: {
      bids: {
        where: {
          status: "ACCEPTED",
        },
      },
      user: true,
    },
  });
  if (!rent) {
    throw new AppError(status.NOT_FOUND, "Rent not found");
  }
  if (rent.status !== "PENDING") {
    const existingPayment = await prisma.payment.findFirst({
      where: { rentId },
    });
    if (existingPayment && existingPayment.status === "succeeded") {
      throw new AppError(
        status.BAD_REQUEST,
        "Payment already completed for this rent",
      );
    }
  }
  const acceptedBid = rent.bids[0];
  if (!acceptedBid) {
    throw new AppError(
      status.BAD_REQUEST,
      "No accepted bid found for this rent",
    );
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: acceptedBid.amount * 100, // Convert to cents
    currency: "usd",
    metadata: { rentId, userId: rent.userId },
    automatic_payment_methods: { enabled: true, allow_redirects: "always" },
  });
  return {
    clientSecret: paymentIntent.client_secret as string,
    amount: acceptedBid.amount,
    transactionId: paymentIntent.id,
  };
};
const savePaymentRecord = async (payload: TPaymentConfirmation) => {
  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        rentId: payload.rentId,
        transactionId: payload.transactionId,
        amount: payload.amount,
        status: payload.status,
        gatewayData: payload.gatewayData,
      },
    });
    if (payload.status === "succeeded") {
      await tx.rent.update({
        where: { id: payload.rentId },
        data: { status: "ONGOING" },
      });
    }
    return payment;
  });
  return result;
};
const confirmPayment = async (rentId: string, transactionId: string) => {
  let paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
  if (paymentIntent.status === "requires_payment_method") {
    //for testing :confirm with a card
    paymentIntent = await stripe.paymentIntents.confirm(transactionId, {
      payment_method: "pm_card_visa",
    });
  }
  if (paymentIntent.status === "succeeded") {
    const amount = paymentIntent.amount / 100; // Convert back to dollars
    //check if payment record already exists
    const existingPayment = await prisma.payment.findFirst({
      where: {
        transactionId,
      },
    });
    if (existingPayment) {
      return existingPayment;
    }
    //save payment record in db
    return await savePaymentRecord({
      rentId,
      transactionId,
      amount,
      status: "succeeded",
      gatewayData: paymentIntent as unknown as Record<string, any>,
    });
  } else {
    throw new AppError(status.BAD_REQUEST, "Payment failed");
  }
};
export const PaymentService = {
  createPaymentIntent,
  confirmPayment,
  savePaymentRecord,
};
