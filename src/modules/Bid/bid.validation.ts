import { z } from "zod";
import { BidStatus } from "../../../generated/prisma/enums";

const createBidSchema = z.object({
  body: z.object({
    amount: z
      .number({ error: "Amount is required" })
      .positive("Amount must be greater than 0"),
    driverLocation: z.string({ error: "Driver location is required" }),
    rentId: z.string({ error: "Rent ID is required" }).uuid({
      message: "Rent ID must be a valid UUID",
    }),
  }),
});

const updateBidStatusSchema = z.object({
  params: z.object({
    id: z.string({ error: "Bid ID is required" }).uuid({
      message: "Bid ID must be a valid UUID",
    }),
  }),
  body: z.object({
    status: z.enum([BidStatus.ACCEPTED, BidStatus.REJECTED]).optional(),
  }),
});

const getBidByIdSchema = z.object({
  params: z.object({
    id: z.string({ error: "Bid ID is required" }).uuid({
      message: "Bid ID must be a valid UUID",
    }),
  }),
});

export const bidValidationSchema = {
  createBid: createBidSchema,
  updateBidStatus: updateBidStatusSchema,
  getBidById: getBidByIdSchema,
};
