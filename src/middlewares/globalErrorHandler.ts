import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/AppError";
import { Prisma } from "../../generated/prisma/client";
import { handleZodError } from "../errors/HandleZodError";
import { handlePrismaError } from "../errors/handlePrismaError";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";
import config from "../config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let error = err.message || "Internal Server Error";
  let stack = err.stack;
  let errorSources: TErrorSources[] = [];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources!];
    statusCode = simplifiedError.statusCode! as number;
    stack = err.stack;
  } else if (
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    const prismaError = handlePrismaError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
    error = prismaError.error;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = 500;
    message = "Internal Server Error";
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources,
    stack: config.NODE_ENV === "development" ? stack : undefined,
    error: config.NODE_ENV === "development" ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
