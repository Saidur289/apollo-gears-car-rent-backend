import express from "express";
import auth from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { CarController } from "./car.controller";
import { carValidationSchema } from "./car.validation";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(carValidationSchema.createCar),
  CarController.createCar,
);

router.get("/", CarController.getCars);
router.get(
  "/:id",
  validateRequest(carValidationSchema.getCarById),
  CarController.getCarById,
);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(carValidationSchema.updateCar),
  CarController.updateCar,
);
router.delete(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(carValidationSchema.getCarById),
  CarController.deleteCar,
);

export const CarRoutes = router;
