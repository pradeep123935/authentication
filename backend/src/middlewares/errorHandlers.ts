import { ErrorRequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/app-error";
import { z } from "zod";
import { clearAuthenticationCookies, REFRESH_PATH } from "../utils/cookie";

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(StatusCodes.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
  });
};
export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  console.error(`Error occured on PATH: ${req.path}`, error);

  if (req.path === REFRESH_PATH) {
    clearAuthenticationCookies(res);
  }

  if (error instanceof SyntaxError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid JSON format!!",
    });
  }

  if (error instanceof z.ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown Error Occured",
  });
};
