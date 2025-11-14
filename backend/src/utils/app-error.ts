import { StatusCodes } from "http-status-codes";
import { ErrorCode } from "../enums/error-code.enum";

export class AppError extends Error {
  public statusCode: StatusCodes;
  public errorCode?: ErrorCode;

  constructor(
    message: string,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCode
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
