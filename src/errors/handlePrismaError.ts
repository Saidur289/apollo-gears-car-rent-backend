import { Prisma } from '../../generated/prisma/client';

export interface TPrismaErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export const handlePrismaError = (
  err:
    | Prisma.PrismaClientValidationError
    | Prisma.PrismaClientUnknownRequestError
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientInitializationError
): TPrismaErrorResponse => {
  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: 'Validation Error',
      error: 'Invalid data provided to database',
    };
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      statusCode: 400,
      message: 'Database Error',
      error: 'An unknown database error occurred',
    };
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      statusCode: 400,
      message: 'Database Error',
      error: err.message,
    };
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 500,
      message: 'Database Initialization Error',
      error: 'Failed to initialize database connection',
    };
  }

  return {
    statusCode: 500,
    message: 'Database Error',
    error: 'An unexpected database error occurred',
  };
};