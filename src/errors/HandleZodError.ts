import status from "http-status";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";
import z from "zod";

export const handleZodError = (error: z.ZodError): TErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const message = "zod validation error";
  const errorSources: TErrorSources[] = [];

  error.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join("=>"),
      message: issue.message,
    });
  });
  return {
    statusCode,
    success: false,
    message,
    errorSources,
  };
};
