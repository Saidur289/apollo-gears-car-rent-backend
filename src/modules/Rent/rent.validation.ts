import { z } from "zod";
import { RentStatus } from "../../../generated/prisma/enums";

const positiveInteger = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }
  return value;
}, z.number().int().positive());

const createRentSchema = z.object({
  body: z.object({
    startingPoint: z.string({ error: "Starting point is required" }),
    destination: z.string({ error: "Destination is required" }),
    carId: z.string({ error: "Car ID is required" }).uuid({
      message: "Car ID must be a valid UUID",
    }),
  }),
});

const updateRentSchema = z.object({
  params: z.object({
    id: z.string({ error: "Rent ID is required" }).uuid({
      message: "Rent ID must be a valid UUID",
    }),
  }),
  body: z.object({
    status: z
      .enum([RentStatus.COMPLETED, RentStatus.PENDING, RentStatus.ONGOING])
      .optional(),
  }),
});

const getRentsSchema = z.object({
  query: z.object({
    page: positiveInteger.optional(),
    limit: positiveInteger.optional(),
    status: z.nativeEnum(RentStatus).optional(),
    sortBy: z
      .enum([
        "startingPoint",
        "destination",
        "carId",
        "status",
        "createdAt",
        "updatedAt",
      ])
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

const getRentByIdSchema = z.object({
  params: z.object({
    id: z.string({ error: "Rent ID is required" }).uuid({
      message: "Rent ID must be a valid UUID",
    }),
  }),
});

export const rentValidationSchema = {
  createRent: createRentSchema,
  updateRent: updateRentSchema,
  getRents: getRentsSchema,
  getRentById: getRentByIdSchema,
};
