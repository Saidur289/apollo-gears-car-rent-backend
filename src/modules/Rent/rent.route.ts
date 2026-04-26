import express from 'express';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { RentController } from './rent.controller';
import { rentValidationSchema } from './rent.validation';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

router.post(
  '/',
  auth(),
  validateRequest(rentValidationSchema.createRent),
  RentController.createRent,
);

router.get(
  '/',
  auth(),
  validateRequest(rentValidationSchema.getRents),
  RentController.getRents,
);

router.get(
  '/:id',
  auth(),
  validateRequest(rentValidationSchema.getRentById),
  RentController.getRentById,
);

router.patch(
  '/:id',
  auth(),
  validateRequest(rentValidationSchema.updateRent),
  RentController.updateRent,
);

router.delete(
  '/:id',
  auth(),
  validateRequest(rentValidationSchema.getRentById),
  RentController.deleteRent,
);

export const RentRoutes = router;