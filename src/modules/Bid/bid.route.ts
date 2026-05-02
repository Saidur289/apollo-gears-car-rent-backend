import express from 'express';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { BidController } from './bid.controller';
import { bidValidationSchema } from './bid.validation';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

// Driver places a bid on a rent
router.post(
  '/',
  auth(Role.DRIVER),
  validateRequest(bidValidationSchema.createBid),
  BidController.createBid,
);

// Get all bids for a specific rent
router.get(
  '/rent/:rentId',
  auth(),
  BidController.getBidsByRent,
);

// Get a specific bid by ID
router.get(
  '/:id',
  auth(),
  validateRequest(bidValidationSchema.getBidById),
  BidController.getBidById,
);

// User accepts a bid (updates rent to ongoing)
router.patch(
  '/:id/accept',
  auth(),
  validateRequest(bidValidationSchema.getBidById),
  BidController.acceptBid,
);

// User rejects a bid
router.patch(
  '/:id/reject',
  auth(),
  validateRequest(bidValidationSchema.getBidById),
  BidController.rejectBid,
);

// Driver deletes their bid
router.delete(
  '/:id',
  auth(Role.DRIVER),
  validateRequest(bidValidationSchema.getBidById),
  BidController.deleteBid,
);

export const BidRoutes = router;