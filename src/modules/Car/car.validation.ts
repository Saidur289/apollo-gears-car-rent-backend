import { z } from "zod";
import { Condition, FuelType } from "../../../generated/prisma/enums";

/**
 * Zod v4 compatible preprocess
 */
const positiveInteger = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }
  return value;
}, z.number().int().positive());

const numericValue = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }
  return value;
}, z.number());

/* -------------------------------------------------------------------------- */
/*                                  CREATE                                    */
/* -------------------------------------------------------------------------- */

const createCarSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(3, { error: "Name must be at least 3 characters long" })
      .max(50, { error: "Name must be at most 50 characters long" }),

    brand: z
      .string({ error: "Brand is required" })
      .min(2, { error: "Brand must be at least 2 characters long" })
      .max(50, { error: "Brand must be at most 50 characters long" }),

    model: z.string({ error: "Model is required" }),

    image: z.string().url({ error: "Image must be a valid URL" }).optional(),

    fuelType: z.nativeEnum(FuelType, {
      error: "Fuel type is required",
    }),

    passengerCapacity: positiveInteger,

    color: z.string({ error: "Color is required" }),

    condition: z.nativeEnum(Condition, {
      error: "Condition is required",
    }),

    rating: numericValue.optional(),
  }),
});

/* -------------------------------------------------------------------------- */
/*                                  UPDATE                                    */
/* -------------------------------------------------------------------------- */

const updateCarSchema = z.object({
  params: z.object({
    id: z.string().uuid({ error: "Car ID must be a valid UUID" }),
  }),

  body: z
    .object({
      name: z.string().min(3).max(50).optional(),

      brand: z.string().min(2).max(50).optional(),

      model: z.string().optional(),

      image: z.string().url({ error: "Image must be a valid URL" }).optional(),

      fuelType: z.nativeEnum(FuelType).optional(),

      passengerCapacity: positiveInteger.optional(),

      color: z.string().optional(),

      condition: z.nativeEnum(Condition).optional(),

      rating: numericValue.optional(),
    })
    .refine((payload) => Object.keys(payload).length > 0, {
      message: "At least one field is required to update",
    }),
});

/* -------------------------------------------------------------------------- */
/*                                  GET ONE                                   */
/* -------------------------------------------------------------------------- */

const getCarByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid({ error: "Car ID must be a valid UUID" }),
  }),
});

/* -------------------------------------------------------------------------- */
/*                                  EXPORT                                    */
/* -------------------------------------------------------------------------- */

export const carValidationSchema = {
  createCar: createCarSchema,
  updateCar: updateCarSchema,
  getCarById: getCarByIdSchema,
};
