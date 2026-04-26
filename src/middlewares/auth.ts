import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import { verifyToken } from '../modules/Auth/auth.utils';
import config from '../config';
import AppError from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { Role } from '../../generated/prisma/enums';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

const auth = (...requiredRoles: Role[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Access token is required');
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    try {
      // Verify token
      const decoded = verifyToken(token, config.jwt.access_secret!);

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
      }

      // Check role permissions
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Insufficient permissions');
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid access token');
    }
  });

export default auth;