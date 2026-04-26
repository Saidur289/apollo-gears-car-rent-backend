import { status } from "http-status";
class AppError extends Error {
  public statusCode: number;

  constructor(
    statusCode: number = status.INTERNAL_SERVER_ERROR,
    message: string,
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
