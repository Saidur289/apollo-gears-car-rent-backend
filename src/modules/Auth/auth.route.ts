import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { authValidationSchema } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(authValidationSchema.register),
  AuthController.registerUser,
);

router.post(
  '/login',
  validateRequest(authValidationSchema.login),
  AuthController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(authValidationSchema.refreshToken),
  AuthController.refreshAccessToken,
);

export const AuthRoutes = router;
