import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { catchAsync } from '../utils/catchAsync';

const validateRequest = (schema: ZodSchema) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      params: req.params,
    });
    next();
  });

export { validateRequest };